import type { PlanSession } from './session-state';
import { validateText } from './validation';

export const questions = [
  'purpose',
  'obstacle',
  'situation',
  'action',
] as const;
export type PlanView = (typeof questions)[number] | 'result';

/** Visual substeps stay out of the v1 payload. Never infer a completed result. */
export function restoreView(session: PlanSession): PlanView {
  if (session.step === 'home') return 'purpose';
  if (session.step === 'plan')
    return validateText('situation', session.inputs.situation).ok
      ? 'action'
      : 'situation';
  return session.step;
}

export function sessionStep(view: PlanView): PlanSession['step'] {
  return view === 'situation' || view === 'action' ? 'plan' : view;
}
