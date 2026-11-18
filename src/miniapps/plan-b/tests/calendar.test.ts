import { describe, expect, it, vi } from 'vitest';
import {
  createCalendarEvent,
  formatFloatingDateTime,
  type CalendarEvent,
} from '../domain/calendar.ts';
import { serializeIcalendar } from '../domain/icalendar.ts';
import { googleCalendarUrl } from '../domain/google-calendar.ts';
import { formatCalendarText } from '../i18n/calendar-copy.ts';
import { es } from '../i18n/es.ts';
import { en } from '../i18n/en.ts';

const example = {
  purpose: 'Hacer ejercicio 3 veces por semana',
  obstacle: 'time',
  otherObstacle: '',
  situation: 'llego a casa después de las 20:00',
  action: 'hago 5 minutos de estiramientos antes de sentarme en el sofá',
  time: '20:00',
  days: ['MO', 'TU', 'WE', 'TH', 'FR'],
};
const uid = '00000000-0000-4000-8000-000000000001';
const exportedAt = () => new Date(2026, 10, 15, 23, 59);
const event = (changes = {}) =>
  createCalendarEvent({ ...example, ...changes }, exportedAt(), uid);

function logicalLines(ics: string) {
  expect(ics.endsWith('\r\n')).toBe(true);
  expect(ics.replaceAll('\r\n', '')).not.toMatch(/[\r\n]/);
  return ics
    .replace(/\r\n[ \t]/g, '')
    .split('\r\n')
    .filter(Boolean);
}

function property(lines: string[], name: string) {
  const stack: string[] = [];
  const matches: string[] = [];
  for (const line of lines) {
    if (line.startsWith('BEGIN:')) stack.push(line.slice(6));
    else if (line.startsWith('END:')) expect(stack.pop()).toBe(line.slice(4));
    else if (stack.at(-1) === 'VEVENT' && line.startsWith(`${name}:`))
      matches.push(line);
  }
  expect(stack).toEqual([]);
  expect(matches).toHaveLength(1);
  return matches[0].slice(name.length + 1);
}

/** Independent minimal reader for the emitted RFC TEXT subset, not the writer. */
function readText(value: string) {
  return value.replace(/\\([nN,;\\])/g, (_, escaped: string) =>
    /[nN]/.test(escaped) ? '\n' : escaped,
  );
}

/** Independent UTC-label enumeration of the serialized rule's 28-day window. */
function expand(start: string, rule: string) {
  const parts = Object.fromEntries(
    rule.split(';').map((part) => part.split('=')),
  );
  expect(parts.FREQ).toBe('WEEKLY');
  expect(parts.WKST).toBe('MO');
  expect(parts).not.toHaveProperty('UNTIL');
  const names = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const count = Number(parts.COUNT);
  const dates: string[] = [];
  const first = new Date(
    `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}T00:00:00Z`,
  );
  for (let day = 0; day < 28; day++) {
    const current = new Date(first.getTime() + day * 86400000);
    if (parts.BYDAY.split(',').includes(names[current.getUTCDay()]))
      dates.push(current.toISOString().slice(0, 10));
  }
  expect(dates).toHaveLength(count);
  return { dates, parts };
}

describe('calendar labels and four-week series', () => {
  it('excludes today even before its scheduled hour', () => {
    const model = createCalendarEvent(
      { ...example, days: ['SU'] },
      new Date(2026, 10, 15, 12),
      uid,
    );
    expect(formatFloatingDateTime(model.start)).toBe('20261122T200000');
  });

  it('matches independent expectations for all 127 day sets and seven export weekdays', () => {
    const names = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    for (let mask = 1; mask < 128; mask++) {
      const days = names.filter((_, index) => mask & (1 << index));
      for (let offset = 0; offset < 7; offset++) {
        const model = createCalendarEvent(
          { ...example, days },
          new Date(2026, 10, 15 + offset, 12),
          uid,
        );
        const lines = logicalLines(
          serializeIcalendar(model, formatCalendarText(model, 'en')),
        );
        const expected: string[] = [];
        for (let ahead = 1; ahead <= 35; ahead++) {
          const date = new Date(Date.UTC(2026, 10, 15 + offset + ahead));
          if (days.includes(names[date.getUTCDay()]))
            expected.push(date.toISOString().slice(0, 10));
        }
        expect(
          expand(property(lines, 'DTSTART'), property(lines, 'RRULE')).dates,
        ).toEqual(expected.slice(0, days.length * 4));
      }
    }
  });
  it('matches the independent November example with exactly 20 occurrences', () => {
    const model = event();
    const lines = logicalLines(
      serializeIcalendar(model, formatCalendarText(model, 'es')),
    );
    expect(property(lines, 'DTSTART')).toBe('20261116T200000');
    expect(property(lines, 'DTEND')).toBe('20261116T201500');
    expect(property(lines, 'RRULE')).toBe(
      'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20;WKST=MO',
    );
    expect(
      expand(property(lines, 'DTSTART'), property(lines, 'RRULE')).dates,
    ).toEqual([
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
      '2026-11-19',
      '2026-11-20',
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
      '2026-12-03',
      '2026-12-04',
      '2026-12-07',
      '2026-12-08',
      '2026-12-09',
      '2026-12-10',
      '2026-12-11',
    ]);
  });

  it.each([
    {
      days: ['MO'],
      expectedStart: '20261116T200000',
      count: 4,
      last: '2026-12-07',
    },
    {
      days: ['SU'],
      expectedStart: '20261122T200000',
      count: 4,
      last: '2026-12-13',
    },
    {
      days: ['SU', 'MO', 'SA', 'FR', 'TH', 'WE', 'TU'],
      expectedStart: '20261116T200000',
      count: 28,
      last: '2026-12-13',
    },
    {
      days: ['FR', 'WE'],
      expectedStart: '20261118T200000',
      count: 8,
      last: '2026-12-11',
    },
  ])(
    'excludes today and gives four instances per day: $days',
    ({ days, expectedStart, count, last }) => {
      const model = event({ days });
      const lines = logicalLines(
        serializeIcalendar(model, formatCalendarText(model, 'en')),
      );
      expect(property(lines, 'DTSTART')).toBe(expectedStart);
      const series = expand(
        property(lines, 'DTSTART'),
        property(lines, 'RRULE'),
      );
      expect(series.dates).toHaveLength(count);
      expect(series.dates.at(-1)).toBe(last);
      for (const day of days) {
        const dayIndex = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(
          day,
        );
        expect(
          series.dates.filter(
            (date) => new Date(`${date}T00:00:00Z`).getUTCDay() === dayIndex,
          ),
        ).toHaveLength(4);
      }
    },
  );

  it.each([
    {
      date: [2026, 11, 31],
      days: ['FR'],
      start: '20270101T235000',
      end: '20270102T000500',
    },
    {
      date: [2024, 1, 28],
      days: ['TH'],
      start: '20240229T235000',
      end: '20240301T000500',
    },
    {
      date: [2025, 1, 28],
      days: ['SA'],
      start: '20250301T235000',
      end: '20250302T000500',
    },
    {
      date: [2026, 2, 7],
      days: ['SU'],
      start: '20260308T235000',
      end: '20260309T000500',
    },
  ])(
    'keeps fifteen wall minutes across calendar boundaries: $start',
    ({ date, days, start, end }) => {
      const model = createCalendarEvent(
        { ...example, time: '23:50', days },
        new Date(date[0], date[1], date[2], 12),
        uid,
      );
      expect(formatFloatingDateTime(model.start)).toBe(start);
      expect(formatFloatingDateTime(model.end)).toBe(end);
    },
  );

  it.each([
    {
      date: [2026, 2, 7],
      days: ['SU'],
      expected: ['2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'],
    },
    {
      date: [2026, 9, 24],
      days: ['SU'],
      expected: ['2026-10-25', '2026-11-01', '2026-11-08', '2026-11-15'],
    },
  ])(
    'preserves floating 02:30 through DST dates without normalizing the hour',
    ({ date, days, expected }) => {
      const model = createCalendarEvent(
        { ...example, time: '02:30', days },
        new Date(date[0], date[1], date[2], 12),
        uid,
      );
      const lines = logicalLines(
        serializeIcalendar(model, formatCalendarText(model, 'en')),
      );
      expect(property(lines, 'DTSTART')).toMatch(/T023000$/);
      expect(property(lines, 'DTEND')).toMatch(/T024500$/);
      expect(
        expand(property(lines, 'DTSTART'), property(lines, 'RRULE')).dates,
      ).toEqual(expected);
      expect(lines.some((line) => /TZID|VTIMEZONE/.test(line))).toBe(false);
    },
  );

  it('uses the export date rather than a narrative date and detaches caller data', () => {
    const plan = structuredClone(example);
    const now = exportedAt();
    const model = createCalendarEvent(plan, now, uid);
    plan.action = 'Una acción distinta';
    plan.days.push('SU');
    now.setMonth(0);
    expect(model.plan.action).toBe(example.action);
    expect(model.byDay).toEqual(['MO', 'TU', 'WE', 'TH', 'FR']);
    expect(formatFloatingDateTime(model.start)).toBe('20261116T200000');
    expect(Object.isFrozen(model)).toBe(true);
    expect(Object.isFrozen(model.plan)).toBe(true);
    expect(Object.isFrozen(model.start)).toBe(true);
    expect(Object.isFrozen(model.byDay)).toBe(true);
  });

  it('accepts low four-digit years without a 1900 offset', () => {
    expect(
      formatFloatingDateTime({
        year: 99,
        month: 12,
        day: 31,
        hour: 23,
        minute: 59,
      }),
    ).toBe('00991231T235900');
  });
});

describe('RFC 5545 containers, identities and TEXT', () => {
  it('writes the calendar, one event, UTC stamp and display alarm', () => {
    const model = event();
    const lines = logicalLines(
      serializeIcalendar(model, formatCalendarText(model, 'es')),
    );
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines.at(-1)).toBe('END:VCALENDAR');
    expect(lines.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(1);
    expect(lines).toContain('VERSION:2.0');
    expect(lines).toContain('PRODID:-//MiMiniApp//Plan B//EN');
    expect(lines).toContain('CALSCALE:GREGORIAN');
    expect(property(lines, 'UID')).toBe(uid);
    expect(property(lines, 'DTSTAMP')).toBe(
      exportedAt().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
    );
    expect(
      lines.slice(
        lines.indexOf('BEGIN:VALARM'),
        lines.indexOf('END:VALARM') + 1,
      ),
    ).toEqual([
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Plan B: ${example.action}`,
      'TRIGGER:PT0M',
      'END:VALARM',
    ]);
  });

  it('keeps supplied new UIDs distinct between exports, without reading a clock itself', () => {
    const first = event();
    const next = createCalendarEvent(
      example,
      exportedAt(),
      '00000000-0000-4000-8000-000000000002',
    );
    expect(next.uid).not.toBe(first.uid);
    expect(next.start).toEqual(first.start);
    expect(next.dtstamp).toBe(first.dtstamp);
  });

  it.each(['es', 'en'] as const)(
    'uses the exact approved %s copy and identical Google text',
    (locale) => {
      const model = event();
      const text = formatCalendarText(model, locale);
      const expected =
        locale === 'es'
          ? {
              summary: `Plan B: ${example.action}`,
              description: `Si ${example.situation}, entonces ${example.action}.\nTu propósito: ${example.purpose}\nHecho con MiMiniApp`,
            }
          : {
              summary: `Bad Day Plan: ${example.action}`,
              description: `If ${example.situation}, then ${example.action}.\nYour goal: ${example.purpose}\nMade with MiMiniApp`,
            };
      expect(text).toEqual(expected);
      const lines = logicalLines(serializeIcalendar(model, text));
      const url = new URL(googleCalendarUrl(model, text));
      expect(readText(property(lines, 'SUMMARY'))).toBe(expected.summary);
      expect(readText(property(lines, 'DESCRIPTION'))).toBe(
        expected.description,
      );
      expect(url.searchParams.get('text')).toBe(expected.summary);
      expect(url.searchParams.get('details')).toBe(expected.description);
    },
  );

  it('preserves punctuation, literal placeholders and encoded text without adding properties', () => {
    const model = event({
      purpose: ' Leer, ahorrar; & # ? 😊 ',
      situation: 'veo \\ una señal: BEGIN:VEVENT',
      action: 'hago <b>{purpose}</b>, sin cambiar; 👨‍👩‍👧‍👦',
    });
    const text = formatCalendarText(model, 'es');
    expect(text.summary).toBe('Plan B: hago <b>{purpose}</b>, sin cambiar; 👨‍👩‍👧‍👦');
    const lines = logicalLines(serializeIcalendar(model, text));
    expect(readText(property(lines, 'SUMMARY'))).toBe(text.summary);
    expect(readText(property(lines, 'DESCRIPTION'))).toBe(text.description);
    expect(lines.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(1);
    expect(
      new URL(googleCalendarUrl(model, text)).searchParams.get('details'),
    ).toBe(text.description);
  });

  it('escapes CRLF in a TEXT value as data, including property-shaped content', () => {
    const model = event();
    const text = {
      summary: 'One, two; \\ three',
      description: 'a\r\nATTENDEE:mailto:test@example.invalid\nEND:VEVENT\rfin',
    };
    const lines = logicalLines(serializeIcalendar(model, text));
    expect(readText(property(lines, 'SUMMARY'))).toBe(text.summary);
    expect(readText(property(lines, 'DESCRIPTION'))).toBe(
      'a\nATTENDEE:mailto:test@example.invalid\nEND:VEVENT\nfin',
    );
    expect(lines.filter((line) => line.startsWith('ATTENDEE:'))).toHaveLength(
      0,
    );
    expect(lines.filter((line) => line === 'END:VEVENT')).toHaveLength(1);
  });

  it.each([
    'a'.repeat(66) + 'á' + 'b'.repeat(180),
    'a'.repeat(67) + '😊' + 'b'.repeat(180),
    'á'.repeat(200),
    '👨‍👩‍👧‍👦'.repeat(40),
    '\\,;'.repeat(90),
  ])(
    'folds every physical line at <=75 UTF-8 octets with exact unfolding',
    (summary) => {
      const model = event();
      const text = { summary, description: `A ${summary}\nB ${summary}` };
      const ics = serializeIcalendar(model, text);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      for (const line of ics.split('\r\n')) {
        expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
        expect(decoder.decode(encoder.encode(line))).toBe(line);
      }
      expect(ics).toContain('\r\n ');
      const lines = logicalLines(ics);
      expect(readText(property(lines, 'SUMMARY'))).toBe(summary);
      expect(readText(property(lines, 'DESCRIPTION'))).toBe(text.description);
    },
  );
});

describe('Google template encoding without communication', () => {
  it('encodes only the five approved parameters with the same dates and recurrence', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('Unexpected network access from a calendar generator.');
    });
    try {
      const model = event({ action: 'a &b=#x? 😎 % + = / <tag> ; \\' });
      const text = formatCalendarText(model, 'en');
      serializeIcalendar(model, text);
      const url = new URL(googleCalendarUrl(model, text));
      expect(url.origin).toBe('https://calendar.google.com');
      expect(url.pathname).toBe('/calendar/render');
      expect(url.hash).toBe('');
      expect([...url.searchParams.keys()].sort()).toEqual([
        'action',
        'dates',
        'details',
        'recur',
        'text',
      ]);
      expect(url.searchParams.get('action')).toBe('TEMPLATE');
      expect(url.searchParams.get('text')).toBe(
        'Bad Day Plan: a &b=#x? 😎 % + = / <tag> ; \\',
      );
      expect(url.searchParams.get('dates')).toBe(
        '20261116T200000/20261116T201500',
      );
      expect(url.searchParams.get('recur')).toBe(
        'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20;WKST=MO',
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });
});

describe('invalid data is rejected before serialization', () => {
  it.each([
    { time: '' },
    { time: '24:00' },
    { days: [] },
    { days: ['MO', 'MO'] },
    { purpose: 'ab' },
    { situation: 'x\nDESCRIPTION:injected' },
  ])('rejects invalid active input %j', (changes) => {
    expect(() => event(changes)).toThrow(RangeError);
  });
  it.each(['bad\r\nATTENDEE:x', '', 'a b', '😊', 'a'.repeat(256)])(
    'rejects a malformed UID %j',
    (identity) => {
      expect(() =>
        createCalendarEvent(example, exportedAt(), identity),
      ).toThrow(RangeError);
    },
  );
  it.each([new Date(NaN), new Date('10000-01-01')])(
    'rejects an unrepresentable clock %j',
    (clock) => {
      expect(() => createCalendarEvent(example, clock, uid)).toThrow(
        RangeError,
      );
    },
  );
  it.each([
    (model: CalendarEvent) => ({ ...model, uid: 'x\r\nEND:VEVENT' }),
    (model: CalendarEvent) => ({ ...model, dtstamp: '20260230T120000Z' }),
    (model: CalendarEvent) => ({ ...model, count: 21 }),
    (model: CalendarEvent) => ({ ...model, byDay: ['FR', 'MO'] }),
    (model: CalendarEvent) => ({ ...model, end: { ...model.end, minute: 99 } }),
    (model: CalendarEvent) => ({
      ...model,
      start: { ...model.start, day: 32 },
    }),
    (model: CalendarEvent) => ({
      ...model,
      plan: { ...model.plan, action: 'x\nUID:bad' },
    }),
  ])('rejects a corrupted shared model on both paths', (corrupt) => {
    const model = event();
    const changed = corrupt(model) as CalendarEvent;
    const text = formatCalendarText(model, 'en');
    expect(() => serializeIcalendar(changed, text)).toThrow(RangeError);
    expect(() => googleCalendarUrl(changed, text)).toThrow(RangeError);
  });
  it.each(['a\u0000b', 'a\u001bb', 'a\u007fb', 'a\ud800b'])(
    'rejects text that cannot be emitted as valid RFC UTF-8 %j',
    (summary) => {
      const model = event();
      const text = { summary, description: 'Synthetic text' };
      expect(() => serializeIcalendar(model, text)).toThrow(RangeError);
      expect(() => googleCalendarUrl(model, text)).toThrow(RangeError);
    },
  );
  it('keeps matching placeholder names in the two dictionaries', () => {
    for (const field of ['summary', 'description'] as const)
      expect(es.calendar[field].match(/\{\w+\}/g)?.sort()).toEqual(
        en.calendar[field].match(/\{\w+\}/g)?.sort(),
      );
  });
});
