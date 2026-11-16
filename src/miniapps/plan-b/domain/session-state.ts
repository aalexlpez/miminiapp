import type { NarrativeDate, LocalDate } from './narrative-date';
import {
  codePointLength,
  defaultDays,
  textLimits,
  validateDays,
  validateObstacle,
  validatePlanInputs,
  validateText,
  validateTime,
  type PlanInputs,
} from './validation';

export const steps = ['home', 'purpose', 'obstacle', 'plan', 'result'] as const;
export type Step = (typeof steps)[number];
export type DraftInputs = Omit<PlanInputs, 'obstacle'> & {
  readonly obstacle: PlanInputs['obstacle'] | '';
};
export interface PlanSession {
  readonly version: 1;
  readonly step: Step;
  readonly inputs: DraftInputs;
  readonly example: boolean;
  readonly narrative: NarrativeDate | null;
}

export function emptySession(): PlanSession {
  return {
    version: 1,
    step: 'home',
    inputs: {
      purpose: '',
      obstacle: '',
      otherObstacle: '',
      situation: '',
      action: '',
      time: '',
      days: [...defaultDays],
    },
    example: false,
    narrative: null,
  };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function keys(value: Record<string, unknown>, expected: string[]) {
  return (
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}
function localDate(value: unknown): value is LocalDate {
  if (!record(value) || !keys(value, ['year', 'month', 'day'])) return false;
  const { year, month, day } = value;
  if (
    typeof year !== 'number' ||
    !Number.isInteger(year) ||
    year < 1 ||
    year > 9999 ||
    typeof month !== 'number' ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    typeof day !== 'number' ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 31
  )
    return false;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function narrativeDate(value: unknown): value is NarrativeDate {
  if (
    !record(value) ||
    !keys(value, ['startedOn', 'nextMonth', 'isJanuary']) ||
    !localDate(value.startedOn) ||
    !localDate(value.nextMonth)
  )
    return false;
  const start = value.startedOn;
  return (
    value.isJanuary === (start.month === 1) &&
    value.nextMonth.day === 1 &&
    value.nextMonth.month === (start.month === 12 ? 1 : start.month + 1) &&
    value.nextMonth.year === start.year + (start.month === 12 ? 1 : 0)
  );
}

/** Partial editable fields are allowed; completed steps must still be valid. */
export function parseSession(raw: string): PlanSession | null {
  if (raw.length > 8192) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !record(value) ||
      !keys(value, ['version', 'step', 'inputs', 'example', 'narrative']) ||
      value.version !== 1 ||
      !steps.some((step) => step === value.step) ||
      typeof value.example !== 'boolean' ||
      !record(value.inputs) ||
      !keys(value.inputs, [
        'purpose',
        'obstacle',
        'otherObstacle',
        'situation',
        'action',
        'time',
        'days',
      ])
    )
      return null;
    const input = value.inputs;
    for (const field of [
      'purpose',
      'otherObstacle',
      'situation',
      'action',
    ] as const) {
      const text = input[field];
      if (
        typeof text !== 'string' ||
        codePointLength(text.trim()) > textLimits[field].max
      )
        return null;
      const result = validateText(field, text);
      if (!result.ok && !['required', 'too-short'].includes(result.error))
        return null;
    }
    if (
      (input.obstacle !== '' && !validateObstacle(input.obstacle).ok) ||
      !validateTime(input.time).ok ||
      !validateDays(input.days, false).ok
    )
      return null;
    if (value.narrative !== null && !narrativeDate(value.narrative))
      return null;
    if (value.step !== 'home' && value.narrative === null) return null;
    if (
      ['obstacle', 'plan', 'result'].includes(value.step as string) &&
      !validateText('purpose', input.purpose).ok
    )
      return null;
    if (
      ['plan', 'result'].includes(value.step as string) &&
      (!validateObstacle(input.obstacle).ok ||
        (input.obstacle === 'other' &&
          !validateText('otherObstacle', input.otherObstacle).ok))
    )
      return null;
    if (value.step === 'result' && !validatePlanInputs(input).ok) return null;
    return value as unknown as PlanSession;
  } catch {
    return null;
  }
}
