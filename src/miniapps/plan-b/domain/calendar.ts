import type { LocalDate } from './narrative-date.ts';
import {
  validateDays,
  validatePlanInputs,
  validateText,
  weekdays,
  type Weekday,
} from './validation.ts';

export interface CalendarMoment extends LocalDate {
  readonly hour: number;
  readonly minute: number;
}

export interface CalendarEvent {
  readonly start: CalendarMoment;
  readonly end: CalendarMoment;
  readonly byDay: readonly Weekday[];
  readonly count: number;
  readonly uid: string;
  readonly dtstamp: string;
  readonly plan: Readonly<{
    purpose: string;
    situation: string;
    action: string;
  }>;
}

export interface CalendarText {
  readonly summary: string;
  readonly description: string;
}

const dayMilliseconds = 86_400_000;
const uidPattern = /^[A-Za-z0-9][A-Za-z0-9.@_-]{0,254}$/;
const pad = (value: number, length = 2) => String(value).padStart(length, '0');

function calendarDay(value: LocalDate): number {
  if (
    !value ||
    !Number.isInteger(value.year) ||
    value.year < 1 ||
    value.year > 9999 ||
    !Number.isInteger(value.month) ||
    value.month < 1 ||
    value.month > 12 ||
    !Number.isInteger(value.day) ||
    value.day < 1 ||
    value.day > 31
  )
    throw new RangeError('Invalid calendar date.');
  // UTC is only arithmetic on calendar labels, never the exported event zone.
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(value.year, value.month - 1, value.day);
  if (date.getUTCMonth() !== value.month - 1 || date.getUTCDate() !== value.day)
    throw new RangeError('Invalid calendar date.');
  return date.getTime() / dayMilliseconds;
}

function dateFromDay(day: number): LocalDate {
  const date = new Date(day * dayMilliseconds);
  const value = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
  calendarDay(value);
  return value;
}

function weekdayOf(day: number): Weekday {
  return weekdays[(new Date(day * dayMilliseconds).getUTCDay() + 6) % 7];
}

function minuteOf(value: CalendarMoment): number {
  const day = calendarDay(value);
  if (
    !Number.isInteger(value.hour) ||
    value.hour < 0 ||
    value.hour > 23 ||
    !Number.isInteger(value.minute) ||
    value.minute < 0 ||
    value.minute > 59
  )
    throw new RangeError('Invalid calendar time.');
  return day * 1440 + value.hour * 60 + value.minute;
}

function endOf(start: CalendarMoment): CalendarMoment {
  const value = minuteOf(start) + 15;
  const minutes = ((value % 1440) + 1440) % 1440;
  return {
    ...dateFromDay(Math.floor(value / 1440)),
    hour: Math.floor(minutes / 60),
    minute: minutes % 60,
  };
}

export function formatFloatingDateTime(value: CalendarMoment): string {
  minuteOf(value);
  return `${pad(value.year, 4)}${pad(value.month)}${pad(value.day)}T${pad(value.hour)}${pad(value.minute)}00`;
}

export function assertCalendarText(value: CalendarText): void {
  if (
    !value ||
    typeof value.summary !== 'string' ||
    typeof value.description !== 'string' ||
    !value.summary.trim() ||
    !value.description.trim()
  )
    throw new RangeError('Calendar text is required.');
  for (const text of [value.summary, value.description]) {
    // Reject characters RFC 5545 cannot represent; never remove user text.
    for (const char of text) {
      const code = char.codePointAt(0)!;
      if (
        (code < 32 && ![9, 10, 13].includes(code)) ||
        code === 127 ||
        (code >= 0xd800 && code <= 0xdfff)
      )
        throw new RangeError(
          'Calendar text contains an unsupported character.',
        );
    }
  }
}

export function assertCalendarEvent(value: CalendarEvent): void {
  if (
    !value ||
    typeof value.uid !== 'string' ||
    !uidPattern.test(value.uid) ||
    typeof value.dtstamp !== 'string' ||
    !/^\d{8}T\d{6}Z$/.test(value.dtstamp)
  )
    throw new RangeError('Invalid calendar identity.');
  const stamp = value.dtstamp;
  const stampTime = Date.parse(
    `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}T${stamp.slice(9, 11)}:${stamp.slice(11, 13)}:${stamp.slice(13, 15)}Z`,
  );
  if (
    !Number.isFinite(stampTime) ||
    new Date(stampTime)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace('.000', '') !== stamp
  )
    throw new RangeError('Invalid calendar timestamp.');
  if (minuteOf(value.end) - minuteOf(value.start) !== 15)
    throw new RangeError('Calendar duration must be fifteen minutes.');
  const selected = validateDays(value.byDay, true);
  if (
    !selected.ok ||
    value.count !== selected.value.length * 4 ||
    !selected.value.includes(weekdayOf(calendarDay(value.start))) ||
    selected.value.join() !==
      weekdays.filter((day) => selected.value.includes(day)).join()
  )
    throw new RangeError('Invalid four-week calendar recurrence.');
  // The complete interval must remain representable, including year rollover.
  dateFromDay(calendarDay(value.start) + 28);
  for (const field of ['purpose', 'situation', 'action'] as const) {
    const result = validateText(field, value.plan?.[field]);
    if (!result.ok || result.value !== value.plan[field])
      throw new RangeError('Invalid calendar plan text.');
  }
  assertCalendarText({
    summary: value.plan.action,
    description: `${value.plan.purpose}\n${value.plan.situation}`,
  });
}

/** Pure: the caller supplies one export-time clock reading and a fresh UID. */
export function createCalendarEvent(
  input: unknown,
  exportedAt: Date,
  uid: string,
): CalendarEvent {
  const result = validatePlanInputs(input);
  if (!result.ok || result.value.time === '')
    throw new RangeError(
      'A complete plan with time and selected days is required.',
    );
  if (
    !(exportedAt instanceof Date) ||
    !Number.isFinite(exportedAt.getTime()) ||
    exportedAt.getUTCFullYear() < 1 ||
    exportedAt.getUTCFullYear() > 9999
  )
    throw new RangeError('A valid export date is required.');
  const plan = result.value;
  const today = calendarDay({
    year: exportedAt.getFullYear(),
    month: exportedAt.getMonth() + 1,
    day: exportedAt.getDate(),
  });
  const byDay = weekdays.filter((day) => plan.days.includes(day));
  let first = today + 1;
  while (!byDay.includes(weekdayOf(first))) first++;
  const [hour, minute] = plan.time.split(':').map(Number);
  const start = { ...dateFromDay(first), hour, minute };
  const event = {
    start: Object.freeze(start),
    end: Object.freeze(endOf(start)),
    byDay: Object.freeze(byDay),
    count: byDay.length * 4,
    uid,
    dtstamp: exportedAt
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z'),
    plan: Object.freeze({
      purpose: plan.purpose,
      situation: plan.situation,
      action: plan.action,
    }),
  };
  assertCalendarEvent(event);
  return Object.freeze(event);
}

export function recurrenceRule(event: CalendarEvent): string {
  assertCalendarEvent(event);
  return `FREQ=WEEKLY;BYDAY=${event.byDay.join(',')};COUNT=${event.count};WKST=MO`;
}
