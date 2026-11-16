import { describe, expect, it } from 'vitest';
import { captureNarrativeDate } from '../domain/narrative-date';
import {
  codePointLength,
  validateDays,
  validateObstacle,
  validatePlanInputs,
  validateText,
  validateTime,
  type TextField,
} from '../domain/validation';
import { metadata } from '../metadata';
import {
  getMiniappPaths,
  getPublishedMetadata,
  validateRegistry,
} from '../../../lib/miniapp-registry';

describe('one-line user text', () => {
  it.each([
    ['purpose', 80],
    ['otherObstacle', 60],
    ['situation', 90],
    ['action', 90],
  ] as const)('%s keeps both limits without truncating', (field, max) => {
    expect(validateText(field, 'ab')).toEqual({
      ok: false,
      error: 'too-short',
    });
    expect(validateText(field, ' abc ')).toEqual({ ok: true, value: 'abc' });
    expect(validateText(field, '🍀'.repeat(max))).toEqual({
      ok: true,
      value: '🍀'.repeat(max),
    });
    expect(validateText(field, 'a'.repeat(max + 1))).toEqual({
      ok: false,
      error: 'too-long',
    });
    expect(validateText(field, '🍀'.repeat(max + 1))).toEqual({
      ok: false,
      error: 'too-long',
    });
    expect(validateText(field, '\u00a0  \t')).toEqual({
      ok: false,
      error: 'required',
    });
  });

  it.each(['\n', '\r', '\r\n', '\v', '\f', '\u0085', '\u2028', '\u2029'])(
    'rejects a pasted line break, including at the edges (%j)',
    (separator) => {
      for (const field of [
        'purpose',
        'otherObstacle',
        'situation',
        'action',
      ] as TextField[])
        for (const text of [
          `abc${separator}`,
          `${separator}abc`,
          `abc${separator}def`,
        ])
          expect(validateText(field, text)).toEqual({
            ok: false,
            error: 'line-break',
          });
    },
  );

  it.each([undefined, null, 123, {}, ['abc']])(
    'rejects non-text %j',
    (input) => {
      expect(validateText('purpose', input)).toEqual({
        ok: false,
        error: 'invalid-type',
      });
    },
  );

  it('counts code points, preserving combining characters and emoji sequences', () => {
    expect(codePointLength('a🍀b')).toBe(3);
    expect(codePointLength('👨‍👩‍👧‍👦')).toBe(7);
    expect(validateText('action', 'e\u0301X')).toEqual({
      ok: true,
      value: 'e\u0301X',
    });
    expect(validateText('action', 'éX')).toEqual({
      ok: false,
      error: 'too-short',
    });
    expect(validateText('action', '🇪🇸a')).toEqual({ ok: true, value: '🇪🇸a' });
  });

  it('only trims outside spaces, without translating, changing case or interpreting markup', () => {
    const input = '  Yo,  CAMINO; <b>10</b> & 😊.  ';
    expect(validateText('situation', input)).toEqual({
      ok: true,
      value: 'Yo,  CAMINO; <b>10</b> & 😊.',
    });
    expect(input).toBe('  Yo,  CAMINO; <b>10</b> & 😊.  ');
  });
});

describe('obstacle and optional schedule inputs', () => {
  it.each([
    'time',
    'motivation',
    'unexpected',
    'overload',
    'forgetting',
    'other',
  ])('accepts the stable obstacle %s', (id) =>
    expect(validateObstacle(id)).toEqual({ ok: true, value: id }),
  );
  it.each(['tiempo', 'TIME', '', null, '__proto__'])(
    'rejects unknown obstacle %j',
    (id) =>
      expect(validateObstacle(id)).toEqual({
        ok: false,
        error: 'invalid-choice',
      }),
  );
  it.each(['', '00:00', '09:05', '12:30', '23:59'])(
    'accepts optional HH:MM %j',
    (time) => expect(validateTime(time)).toEqual({ ok: true, value: time }),
  );
  it.each([
    '9:00',
    '24:00',
    '12:60',
    '12:00:00',
    ' 12:00',
    '12:00\n',
    '１２:００',
    null,
    1200,
  ])('rejects malformed time %j', (time) =>
    expect(validateTime(time)).toEqual({ ok: false, error: 'invalid-time' }),
  );
  it('requires a day only with time and keeps a detached set of selected days', () => {
    expect(validateDays([], false)).toEqual({ ok: true, value: [] });
    expect(validateDays([], true)).toEqual({
      ok: false,
      error: 'days-required',
    });
    const selected = ['SU', 'MO'];
    const result = validateDays(selected, true);
    expect(result).toEqual({ ok: true, value: ['SU', 'MO'] });
    selected.push('TU');
    expect(result).toEqual({ ok: true, value: ['SU', 'MO'] });
  });
  it.each(
    [['MO', 'MO'], ['Monday'], [0], [undefined], new Array(1), 'MO', null].map(
      (days) => ({ days }),
    ),
  )('rejects a non-set or invalid weekday selection $days', ({ days }) =>
    expect(validateDays(days, false)).toEqual({
      ok: false,
      error: 'invalid-days',
    }),
  );
});

describe('complete input boundary', () => {
  const example = {
    purpose: ' Caminar un poco ',
    obstacle: 'time',
    otherObstacle: '',
    situation: ' tengo poco tiempo ',
    action: ' doy una vuelta de cinco minutos ',
    time: '20:00',
    days: ['MO', 'TU', 'WE', 'TH', 'FR'],
  };

  it('returns the same validated words without mutating draft input', () => {
    const previous = structuredClone(example);
    expect(validatePlanInputs(example)).toEqual({
      ok: true,
      value: {
        ...example,
        purpose: 'Caminar un poco',
        situation: 'tengo poco tiempo',
        action: 'doy una vuelta de cinco minutos',
      },
    });
    expect(example).toEqual(previous);
  });
  it('requires the custom text only for Other', () => {
    expect(validatePlanInputs({ ...example, obstacle: 'other' })).toEqual({
      ok: false,
      errors: { otherObstacle: 'required' },
    });
    const other = validatePlanInputs({
      ...example,
      obstacle: 'other',
      otherObstacle: '  Mis horarios  ',
    });
    expect(other.ok && other.value.otherObstacle).toBe('Mis horarios');
    const predefined = validatePlanInputs({ ...example, otherObstacle: '\n' });
    expect(predefined.ok && predefined.value.otherObstacle).toBe('');
  });
  it('allows no schedule and reports each active invalid field', () => {
    expect(validatePlanInputs({ ...example, time: '', days: [] }).ok).toBe(
      true,
    );
    expect(
      validatePlanInputs({
        ...example,
        purpose: 'a',
        situation: 'a\nb',
        action: '',
        days: [],
      }),
    ).toEqual({
      ok: false,
      errors: {
        purpose: 'too-short',
        situation: 'line-break',
        action: 'required',
        days: 'days-required',
      },
    });
  });
  it.each([undefined, null, [], 'text', {}])(
    'rejects incomplete or non-record data %j',
    (input) => {
      expect(validatePlanInputs(input).ok).toBe(false);
    },
  );
});

describe('narrative date captured once in local calendar time', () => {
  it.each([
    [2026, 1, 31, 2026, 2],
    [2024, 2, 29, 2024, 3],
    [2025, 2, 28, 2025, 3],
    [2026, 4, 30, 2026, 5],
    [2026, 12, 31, 2027, 1],
  ])(
    '%i-%i-%i goes to the first of %i-%i',
    (year, month, day, nextYear, nextMonth) => {
      expect(
        captureNarrativeDate(() => new Date(year, month - 1, day, 23, 59)),
      ).toEqual({
        startedOn: { year, month, day },
        nextMonth: { year: nextYear, month: nextMonth, day: 1 },
        isJanuary: month === 1,
      });
    },
  );
  it('uses the annual question only for January', () => {
    for (let month = 1; month <= 12; month++)
      expect(
        captureNarrativeDate(() => new Date(2026, month - 1, 1)).isJanuary,
      ).toBe(month === 1);
  });
  it('does not change a session at midnight/month rollover or when the clock Date mutates', () => {
    const now = new Date(2026, 0, 31, 23, 59);
    let calls = 0;
    const story = captureNarrativeDate(() => {
      calls++;
      return now;
    });
    now.setDate(1);
    now.setMonth(1);
    expect(calls).toBe(1);
    expect(story).toEqual({
      startedOn: { year: 2026, month: 1, day: 31 },
      nextMonth: { year: 2026, month: 2, day: 1 },
      isJanuary: true,
    });
    expect(captureNarrativeDate(() => now).startedOn).toEqual({
      year: 2026,
      month: 2,
      day: 1,
    });
    expect(Object.isFrozen(story.startedOn)).toBe(true);
    expect(Object.isFrozen(story.nextMonth)).toBe(true);
  });
  it('rejects an invalid clock without silently inventing a date', () => {
    expect(() => captureNarrativeDate(() => new Date(Number.NaN))).toThrow(
      RangeError,
    );
  });
});

it('keeps pure bilingual draft metadata excluded from catalogue and routes', () => {
  const registry = [{ descriptor: metadata }];
  expect(validateRegistry(registry)).toEqual(registry);
  expect(getPublishedMetadata(registry)).toEqual([]);
  expect(getMiniappPaths(registry)).toEqual([]);
  expect(metadata).not.toHaveProperty('loadEntry');
  expect(metadata).not.toHaveProperty('publishedAt');
  expect(metadata.copy.es.title).toBe('Plan B');
  expect(metadata.copy.en.title).toBe('Bad Day Plan');
});
