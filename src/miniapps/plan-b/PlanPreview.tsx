import type { PlanCopy } from './i18n/copy';
import type { DraftInputs } from './domain/session-state';

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlanPreview({
  inputs,
  copy,
}: {
  inputs: DraftInputs;
  copy: PlanCopy;
}) {
  const flow = copy.flow;
  return (
    <aside className="pb-preview" aria-labelledby="pb-preview-title">
      <div className="pb-preview-caption">
        <span id="pb-preview-title">
          {inputs.situation || inputs.action
            ? flow.previewTitle
            : flow.previewExample}
        </span>
        <span className="pb-paper-mark" aria-hidden="true">
          B
        </span>
      </div>
      <div className="pb-paper">
        <p className="pb-paper-goal" dir="auto">
          {inputs.purpose.trim() || flow.previewGoal}
        </p>
        <p className="pb-paper-sentence" dir="auto">
          <span className="pb-connector">{copy.ui.if}</span>{' '}
          <span className={inputs.situation ? undefined : 'pb-ghost'}>
            {inputs.situation.trim() || flow.previewSituation}
          </span>
          , <span className="pb-connector">{copy.ui.then}</span>{' '}
          <span className={inputs.action ? undefined : 'pb-ghost'}>
            {inputs.action.trim() || flow.previewAction}
          </span>
          .
        </p>
        <svg className="pb-continuity" viewBox="0 0 320 40" aria-hidden="true">
          <path
            d="M4 23H110Q136 23 145 10Q155-2 167 12Q176 25 200 25H315"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="pb-paper-note">{flow.previewNote}</p>
      </div>
      <p className="pb-preview-footer">{flow.previewFooter}</p>
    </aside>
  );
}
