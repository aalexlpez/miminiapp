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
import { restoreView, sessionStep, type PlanView } from '../domain/flow';
import { validatePlanInputs, type Weekday } from '../domain/validation';

export interface Snapshot {
  readonly session: PlanSession;
  readonly ready: boolean;
  readonly memoryOnly: boolean;
  readonly warnings: readonly SessionWarning[];
  readonly previewDate: NarrativeDate | null;
  readonly view: PlanView;
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
    view: 'purpose',
  };
  let snapshot = initial;
  const listeners = new Set<() => void>();
  function publish(session: PlanSession, persist = true, view = snapshot.view) {
    if (persist) store.save(session);
    snapshot = { ...snapshot, session, view, ...store.status() };
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
        view: restoreView(session),
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
      publish(session, true, 'purpose');
    },
    update<K extends keyof DraftInputs>(field: K, value: DraftInputs[K]) {
      const session = snapshot.session;
      if (JSON.stringify(session.inputs[field]) === JSON.stringify(value))
        return;
      publish({
        ...session,
        ...(session.step === 'home'
          ? { step: 'purpose' as const, narrative: captureNarrativeDate(clock) }
          : {}),
        inputs: { ...session.inputs, [field]: value },
        example: false,
      });
    },
    go(step: Step) {
      const session = { ...snapshot.session, step };
      publish(session, true, restoreView(session));
    },
    show(view: PlanView) {
      const step =
        view === 'result' && !validatePlanInputs(snapshot.session.inputs).ok
          ? 'plan'
          : sessionStep(view);
      publish(
        {
          ...snapshot.session,
          step,
          narrative: snapshot.session.narrative ?? captureNarrativeDate(clock),
        },
        true,
        view,
      );
    },
    commitSchedule(time: string, days: readonly Weekday[]) {
      const session = snapshot.session;
      const inputs = { ...session.inputs, time, days: [...days] };
      if (snapshot.view !== 'result' || !validatePlanInputs(inputs).ok)
        return false;
      if (JSON.stringify(inputs) !== JSON.stringify(session.inputs))
        publish({ ...session, step: 'result', inputs, example: false });
      return true;
    },
    markEdited() {
      if (snapshot.session.example)
        publish({ ...snapshot.session, example: false });
    },
    reset() {
      store.clear();
      snapshot = { ...snapshot, previewDate: captureNarrativeDate(clock) };
      publish(emptySession(), false, 'purpose');
    },
  };
}
