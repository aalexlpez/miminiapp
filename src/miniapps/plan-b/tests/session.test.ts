import { describe, expect, it } from 'vitest';
import { emptySession, parseSession } from '../domain/session-state';
import { captureNarrativeDate } from '../domain/narrative-date';
import {
  createSessionStore,
  sessionKey,
  type SessionStoragePort,
} from '../browser/session';
import { createPlanController } from '../browser/controller';
import { getPlanCopy } from '../i18n/copy';
import { defaultDays } from '../domain/validation';

const date = () => new Date(2026, 0, 31, 23, 59);
const example = {
  ...getPlanCopy('es').example,
  obstacle: 'time' as const,
  otherObstacle: '',
  time: '20:00',
  days: [...defaultDays],
};
function storage(): SessionStoragePort & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}
function saved() {
  return {
    ...emptySession(),
    step: 'result' as const,
    inputs: example,
    example: true,
    narrative: captureNarrativeDate(date),
  };
}

describe('validated versioned session', () => {
  it('roundtrips the supported steps and preserves literal text/date', () => {
    for (const step of [
      'home',
      'purpose',
      'obstacle',
      'plan',
      'result',
    ] as const) {
      const state = { ...saved(), step };
      expect(parseSession(JSON.stringify(state))).toEqual(state);
    }
    const partial = {
      ...saved(),
      step: 'purpose',
      inputs: { ...example, purpose: 'a' },
    };
    expect(parseSession(JSON.stringify(partial))).toEqual(partial);
  });
  it.each(['no json', 'null', '[]', '{}', '"text"', 'a'.repeat(8193)])(
    'rejects malformed data %j',
    (raw) => expect(parseSession(raw)).toBeNull(),
  );
  it.each([
    { version: 2 },
    { step: 'other' },
    { example: 'true' },
    { narrative: null },
    { unwanted: 'data' },
    { inputs: { ...example, action: 'x\ny' } },
    { inputs: { ...example, purpose: 'a' } },
    { inputs: { ...example, time: '25:00' } },
    { inputs: { ...example, days: [] } },
    { inputs: { ...example, days: ['MO', 'MO'] } },
    { inputs: { ...example, obstacle: 'unknown' } },
    { inputs: { ...example, action: 'a'.repeat(91) } },
    { inputs: { ...example, another: 'unexpected' } },
    {
      narrative: {
        ...captureNarrativeDate(date),
        nextMonth: { year: 2026, month: 3, day: 1 },
      },
    },
    {
      narrative: {
        ...captureNarrativeDate(date),
        startedOn: { year: 2026, month: 2, day: 30 },
      },
    },
  ])('discards invalid or incompatible state %j', (changes) =>
    expect(parseSession(JSON.stringify({ ...saved(), ...changes }))).toBeNull(),
  );
  it('allows unfinished current fields, but not unfinished completed steps', () => {
    const draft = {
      ...saved(),
      step: 'purpose',
      inputs: { ...example, purpose: '' },
    };
    expect(parseSession(JSON.stringify(draft))).not.toBeNull();
    expect(
      parseSession(JSON.stringify({ ...draft, step: 'obstacle' })),
    ).toBeNull();
    expect(
      parseSession(
        JSON.stringify({
          ...saved(),
          step: 'obstacle',
          inputs: { ...example, obstacle: 'other', otherObstacle: '' },
        }),
      ),
    ).not.toBeNull();
    expect(
      parseSession(
        JSON.stringify({
          ...saved(),
          step: 'plan',
          inputs: { ...example, obstacle: 'other', otherObstacle: '' },
        }),
      ),
    ).toBeNull();
  });
});

describe('storage failures and key isolation', () => {
  it('does not write on load and clears only its own key', () => {
    const port = storage();
    port.data.set('miminiapp.appearance', 'dark');
    port.data.set('unrelated', 'keep');
    const store = createSessionStore(() => port);
    expect(store.load()).toBeNull();
    expect(port.data.has(sessionKey)).toBe(false);
    store.save(saved());
    expect(port.data.has(sessionKey)).toBe(true);
    store.clear();
    expect([...port.data]).toEqual([
      ['miminiapp.appearance', 'dark'],
      ['unrelated', 'keep'],
    ]);
  });
  it('removes corrupt own data and explains discard', () => {
    const port = storage();
    port.data.set(sessionKey, 'broken');
    const store = createSessionStore(() => port);
    expect(store.load()).toBeNull();
    expect(store.status().warnings).toContain('invalid');
    expect(port.data.has(sessionKey)).toBe(false);
  });
  it('handles denied reads and remains usable in memory', () => {
    const store = createSessionStore(() => {
      throw new Error('Denied');
    });
    const controller = createPlanController(store, date);
    controller.initialize();
    controller.begin(example);
    controller.go('result');
    expect(controller.getSnapshot().session.step).toBe('result');
    expect(controller.getSnapshot().memoryOnly).toBe(true);
    expect(controller.getSnapshot().warnings).toContain('unavailable');
    controller.reset();
    expect(controller.getSnapshot().warnings).toContain('delete-failed');
  });
  it('removes a stale saved copy on write failure and preserves the current session', () => {
    const port = storage();
    port.data.set(sessionKey, JSON.stringify(saved()));
    port.setItem = () => {
      throw new Error('Quota');
    };
    const controller = createPlanController(
      createSessionStore(() => port),
      date,
    );
    controller.initialize();
    controller.update('purpose', 'Un propósito distinto');
    expect(controller.getSnapshot().session.inputs.purpose).toBe(
      'Un propósito distinto',
    );
    expect(controller.getSnapshot().memoryOnly).toBe(true);
    expect(port.data.has(sessionKey)).toBe(false);
  });
  it('does not claim a successful reset when removal fails', () => {
    const port = storage();
    port.data.set(sessionKey, JSON.stringify(saved()));
    port.removeItem = () => {
      throw new Error('Denied');
    };
    const controller = createPlanController(
      createSessionStore(() => port),
      date,
    );
    controller.initialize();
    controller.reset();
    expect(controller.getSnapshot().session).toEqual(emptySession());
    expect(controller.getSnapshot().warnings).toContain('delete-failed');
    expect(port.data.has(sessionKey)).toBe(true);
    expect(controller.getSnapshot().memoryOnly).toBe(true);
  });
});

it('keeps example/date across navigation and clears its tag only for an effective edit', () => {
  const port = storage();
  let now = date();
  const controller = createPlanController(
    createSessionStore(() => port),
    () => now,
  );
  controller.initialize();
  controller.begin(example);
  const narrative = controller.getSnapshot().session.narrative;
  now = new Date(2026, 1, 1, 0, 1);
  controller.go('obstacle');
  controller.go('plan');
  controller.update('purpose', example.purpose);
  expect(controller.getSnapshot().session.example).toBe(true);
  expect(controller.getSnapshot().session.narrative).toBe(narrative);
  const restored = createPlanController(
    createSessionStore(() => port),
    () => now,
  );
  restored.initialize();
  expect(restored.getSnapshot().session).toEqual(
    controller.getSnapshot().session,
  );
  controller.update('action', 'hago algo diferente');
  expect(controller.getSnapshot().session.example).toBe(false);
  expect(controller.getSnapshot().session.inputs.situation).toBe(
    example.situation,
  );
  controller.reset();
  controller.begin();
  expect(controller.getSnapshot().session.narrative?.startedOn.month).toBe(2);
});

it('refreshes the home month after reset while keeping the active story stable', () => {
  const port = storage();
  let now = date();
  const controller = createPlanController(
    createSessionStore(() => port),
    () => now,
  );
  controller.initialize();
  controller.begin(example);
  now = new Date(2026, 1, 1, 12);
  controller.go('result');
  expect(controller.getSnapshot().session.narrative?.nextMonth.month).toBe(2);
  controller.reset();
  expect(controller.getSnapshot().previewDate?.nextMonth).toEqual({
    year: 2026,
    month: 3,
    day: 1,
  });
  expect(port.data.has(sessionKey)).toBe(false);
});

describe('approved guided view over v1 sessions', () => {
  it('starts on the first real edit without persisting a visual substep', () => {
    const port = storage();
    let now = new Date(2026, 0, 31, 23, 59);
    const controller = createPlanController(
      createSessionStore(() => port),
      () => now,
    );
    controller.initialize();
    expect(port.data.has(sessionKey)).toBe(false);
    now = new Date(2026, 1, 1, 0, 1);
    controller.update('purpose', 'Leer más');
    const session = controller.getSnapshot().session;
    expect(session.narrative?.startedOn).toMatchObject({ month: 2, day: 1 });
    expect(controller.getSnapshot().view).toBe('purpose');
    expect(JSON.parse(port.data.get(sessionKey)!)).not.toHaveProperty('view');
    expect(parseSession(port.data.get(sessionKey)!)).toEqual(session);
  });
  it.each(['', 'x', 'llego tarde'])(
    'restores the unfinished plan view for %j without inferring a result',
    (situation) => {
      const port = storage();
      port.data.set(
        sessionKey,
        JSON.stringify({
          ...saved(),
          step: 'plan',
          inputs: { ...example, situation },
        }),
      );
      const controller = createPlanController(
        createSessionStore(() => port),
        date,
      );
      controller.initialize();
      expect(controller.getSnapshot().view).toBe(
        situation.length < 3 ? 'situation' : 'action',
      );
      expect(controller.getSnapshot().session.inputs.action).toBe(
        example.action,
      );
      controller.show('situation');
      controller.update('situation', 'otra señal');
      expect(controller.getSnapshot().view).toBe('situation');
    },
  );
  it('preserves a legacy incomplete schedule and commits only a valid result atomically', () => {
    const port = storage();
    port.data.set(
      sessionKey,
      JSON.stringify({
        ...saved(),
        step: 'plan',
        inputs: { ...example, days: [] },
      }),
    );
    const controller = createPlanController(
      createSessionStore(() => port),
      date,
    );
    controller.initialize();
    controller.show('result');
    expect(controller.getSnapshot().view).toBe('result');
    expect(controller.getSnapshot().session.step).toBe('plan');
    expect(controller.getSnapshot().session.inputs.time).toBe('20:00');
    const before = port.data.get(sessionKey);
    expect(controller.commitSchedule('21:30', [])).toBe(false);
    expect(controller.commitSchedule('25:00', ['MO'])).toBe(false);
    expect(port.data.get(sessionKey)).toBe(before);
    expect(controller.commitSchedule('21:30', ['MO'])).toBe(true);
    const savedResult = parseSession(port.data.get(sessionKey)!);
    expect(savedResult?.step).toBe('result');
    expect(savedResult?.inputs).toMatchObject({
      time: '21:30',
      days: ['MO'],
      action: example.action,
    });
    const restored = createPlanController(
      createSessionStore(() => port),
      date,
    );
    restored.initialize();
    expect(restored.getSnapshot().view).toBe('result');
    expect(restored.commitSchedule('', [])).toBe(true);
    expect(parseSession(port.data.get(sessionKey)!)?.inputs.time).toBe('');
  });
});

it('starts a valid legacy home draft on navigation even if it has no narrative yet', () => {
  const port = storage();
  port.data.set(
    sessionKey,
    JSON.stringify({ ...emptySession(), inputs: example }),
  );
  const controller = createPlanController(
    createSessionStore(() => port),
    date,
  );
  controller.initialize();
  expect(controller.getSnapshot().view).toBe('purpose');
  expect(controller.getSnapshot().session.inputs.purpose).toBe(example.purpose);
  controller.show('obstacle');
  expect(
    parseSession(port.data.get(sessionKey)!)?.narrative?.startedOn,
  ).toMatchObject({ year: 2026, month: 1, day: 31 });
  expect(controller.getSnapshot().session.inputs.action).toBe(example.action);
});
