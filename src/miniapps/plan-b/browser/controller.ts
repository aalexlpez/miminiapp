import {
  captureNarrativeDate,
  type NarrativeDate,
} from '../domain/narrative-date';
import {
  emptySession,
  type DraftInputs,
  type PlanSession,
  type Step,
} from '../domain/session-state';
import { createSessionStore, type SessionWarning } from './session';

export interface Snapshot {
  readonly session: PlanSession;
  readonly ready: boolean;
  readonly memoryOnly: boolean;
  readonly warnings: readonly SessionWarning[];
  readonly previewDate: NarrativeDate | null;
}

export function createPlanController(
  store: ReturnType<typeof createSessionStore>,
  clock: () => Date,
) {
  const initial: Snapshot = {
    session: emptySession(),
    ready: false,
    memoryOnly: false,
    warnings: [],
    previewDate: null,
  };
  let snapshot = initial;
  const listeners = new Set<() => void>();
  function publish(session: PlanSession, persist = true) {
    if (persist) store.save(session);
    snapshot = { ...snapshot, session, ...store.status() };
    for (const listener of listeners) listener();
  }
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    initialize() {
      if (snapshot.ready) return;
      const session = store.load() ?? emptySession();
      snapshot = {
        session,
        ready: true,
        ...store.status(),
        previewDate: session.narrative ?? captureNarrativeDate(clock),
      };
      for (const listener of listeners) listener();
    },
    begin(example?: DraftInputs) {
      const session: PlanSession = {
        ...emptySession(),
        step: 'purpose',
        narrative: captureNarrativeDate(clock),
        ...(example
          ? { inputs: { ...example, days: [...example.days] }, example: true }
          : {}),
      };
      publish(session);
    },
    update<K extends keyof DraftInputs>(field: K, value: DraftInputs[K]) {
      const session = snapshot.session;
      if (JSON.stringify(session.inputs[field]) === JSON.stringify(value))
        return;
      publish({
        ...session,
        inputs: { ...session.inputs, [field]: value },
        example: false,
      });
    },
    go(step: Step) {
      publish({ ...snapshot.session, step });
    },
    reset() {
      store.clear();
      snapshot = { ...snapshot, previewDate: captureNarrativeDate(clock) };
      publish(emptySession(), false);
    },
  };
}
