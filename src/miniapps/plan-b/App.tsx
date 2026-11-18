import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ClipboardEvent,
  type SubmitEvent,
} from 'react';
import type { Locale } from '../../lib/locales';
import { createPlanController } from './browser/controller';
import { createSessionStore } from './browser/session';
import { questions, type PlanView } from './domain/flow';
import {
  codePointLength,
  defaultDays,
  obstacleIds,
  textLimits,
  validatePlanInputs,
  validateText,
  type InputErrors,
  type TextField,
  type ValidationError,
} from './domain/validation';
import type { PlanCopy } from './i18n/copy';
import { fill } from './i18n/fill';
import ExportPanel from './ExportPanel';
import PlanPreview, { Arrow } from './PlanPreview';
import ScheduleEditor from './ScheduleEditor';

export default function App({
  locale,
  copy,
}: {
  locale: Locale;
  copy: PlanCopy;
}) {
  const [controller] = useState(() =>
    createPlanController(
      createSessionStore(() => window.sessionStorage),
      () => new Date(),
    ),
  );
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getServerSnapshot,
  );
  const { session, view, ready, memoryOnly, warnings } = snapshot;
  const { inputs } = session;
  const [errors, setErrors] = useState<InputErrors>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const lastView = useRef<PlanView | null>(null);
  const otherInput = useRef<HTMLInputElement>(null);
  const exampleFocus = useRef(false);
  const ui = copy.ui,
    flow = copy.flow;
  useEffect(() => {
    controller.initialize();
  }, [controller]);
  useEffect(() => {
    if (!ready || (lastView.current === view && !exampleFocus.current)) return;
    const first = lastView.current === null;
    lastView.current = view;
    exampleFocus.current = false;
    if (first && session.step === 'home') return;
    heading.current?.focus();
  }, [ready, view, session.step, session.narrative]);
  useEffect(() => {
    if (view === 'obstacle' && inputs.obstacle === 'other')
      otherInput.current?.focus();
  }, [view, inputs.obstacle]);
  useEffect(() => {
    function beforeLocaleNavigation(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(
        '.locale-navigation a[href]',
      );
      const current = controller.getSnapshot();
      if (!link || !current.memoryOnly || current.session.step === 'home')
        return;
      const url = new URL(link.href);
      if (
        url.origin === window.location.origin &&
        /^\/(es|en)\/apps\/plan-b\/$/.test(url.pathname) &&
        !url.pathname.startsWith(`/${locale}/`) &&
        !window.confirm(ui.languageLoss)
      )
        event.preventDefault();
    }
    document.addEventListener('click', beforeLocaleNavigation, true);
    return () =>
      document.removeEventListener('click', beforeLocaleNavigation, true);
  }, [controller, locale, ui.languageLoss]);
  const narrative = session.narrative ?? snapshot.previewDate;
  const nextMonth = narrative
    ? new Intl.DateTimeFormat(locale, {
        month: 'long',
        timeZone: 'UTC',
      }).format(
        new Date(
          Date.UTC(narrative.nextMonth.year, narrative.nextMonth.month - 1, 1),
        ),
      )
    : '';
  const titles = {
    purpose: narrative?.isJanuary ? ui.januaryQuestion : ui.question,
    obstacle: flow.obstacleTitle,
    situation: flow.situationTitle,
    action: flow.actionTitle,
    result: flow.resultTitle,
  };
  const hints = {
    purpose: flow.purposeHint,
    obstacle: `${fill(ui.obstacleQuestion, { month: nextMonth })} ${ui.obstacleHint}`,
    situation: flow.situationHint,
    action: flow.actionHint,
    result: flow.resultHint,
  };
  const nextLabels = {
    purpose: flow.nextPurpose,
    obstacle: flow.nextOther,
    situation: flow.nextSituation,
    action: ui.viewPlan,
  };
  const validation = validatePlanInputs(inputs);
  // Keep legacy unconfirmed calendar drafts intact without blocking the phrase.
  const phrase = validation.ok
    ? validation
    : validatePlanInputs({ ...inputs, time: '', days: [] });
  function go(next: PlanView) {
    setErrors({});
    controller.show(next);
  }
  function beginExample() {
    setErrors({});
    exampleFocus.current = true;
    controller.begin({
      ...copy.example,
      obstacle: 'time',
      otherObstacle: '',
      time: '20:00',
      days: [...defaultDays],
    });
  }
  function message(error: ValidationError, field: TextField) {
    if (error === 'line-break') return ui.errorLine;
    if (error === 'required' || error === 'invalid-type')
      return ui.errorRequired;
    return fill(ui.errorLength, textLimits[field]);
  }
  function changeText(field: TextField, value: string) {
    controller.update(field, value);
    const result = validateText(field, value);
    setErrors((current) => ({
      ...current,
      [field]:
        !result.ok &&
        (current[field] || ['line-break', 'too-long'].includes(result.error))
          ? result.error
          : undefined,
    }));
  }
  function paste(
    event: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: TextField,
  ) {
    const result = validateText(field, event.clipboardData.getData('text'));
    if (!result.ok && result.error === 'line-break') {
      event.preventDefault();
      setErrors((current) => ({ ...current, [field]: 'line-break' }));
    }
  }
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (controller.getSnapshot().view !== view || view === 'result') return;
    const name = view === 'obstacle' ? 'otherObstacle' : view;
    const checked = validateText(name, inputs[name]);
    if (!checked.ok) {
      setErrors({ [name]: checked.error });
      document.getElementById(`pb-${name}`)?.focus();
      return;
    }
    if (view === 'purpose') go('obstacle');
    else if (view === 'obstacle') go('situation');
    else if (view === 'situation') go('action');
    else if (phrase.ok) go('result');
  }
  function field(name: TextField, label: string, multiline = false) {
    const count = codePointLength(inputs[name].trim());
    const showCount = count >= textLimits[name].max - 20;
    const props = {
      id: `pb-${name}`,
      name,
      value: inputs[name],
      autoComplete: 'off',
      disabled: !ready,
      'aria-invalid': !!errors[name],
      'aria-describedby':
        [
          showCount ? `pb-${name}-count` : '',
          errors[name] ? `pb-${name}-error` : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      onChange: (event: { target: { value: string } }) =>
        changeText(name, event.target.value),
      onPaste: (
        event: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => paste(event, name),
    };
    return (
      <div className="pb-field">
        <label htmlFor={props.id}>{label}</label>
        {multiline ? (
          <textarea {...props} rows={2} dir="auto" />
        ) : (
          <input
            {...props}
            ref={name === 'otherObstacle' ? otherInput : undefined}
            type="text"
            dir="auto"
            placeholder={
              name === 'otherObstacle'
                ? ui.otherPlaceholder
                : flow.purposePlaceholder
            }
          />
        )}
        {showCount && (
          <span id={`pb-${name}-count`} className="pb-counter">
            {fill(ui.counterTemplate, {
              current: count,
              max: textLimits[name].max,
            })}
          </span>
        )}
        {errors[name] && (
          <p id={`pb-${name}-error`} role="alert" className="pb-error">
            {message(errors[name]!, name)}
          </p>
        )}
      </div>
    );
  }
  function suggestions(name: TextField, values: string[]) {
    return (
      values.length > 0 && (
        <details className="pb-ideas">
          <summary>{flow.ideas}</summary>
          <div className="pb-suggestions">
            {values.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  changeText(name, value);
                  document.getElementById(`pb-${name}`)?.focus();
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </details>
      )
    );
  }
  const index = questions.indexOf(view as (typeof questions)[number]);
  const obstacle = inputs.obstacle;
  const previous: Record<Exclude<PlanView, 'purpose'>, PlanView> = {
    obstacle: 'purpose',
    situation: 'obstacle',
    action: 'situation',
    result: 'action',
  };
  return (
    <section
      className="pb-app"
      data-testid="plan-b-app"
      data-ready={ready}
      data-step={session.step}
      data-view={view}
      aria-labelledby="pb-step-title"
      onClickCapture={(event) => {
        if (
          event.detail > 1 &&
          event.target instanceof Element &&
          event.target.closest('[data-pb-navigation]')
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <aside role="status" aria-atomic="true" className="pb-notices">
        {memoryOnly && <p>{ui.memory}</p>}
        {warnings.includes('invalid') && session.step === 'home' && (
          <p>{ui.invalid}</p>
        )}
        {warnings.includes('delete-failed') && <p>{ui.deleteFailed}</p>}
      </aside>
      <div className="pb-workspace">
        <div className="pb-journey">
          {view !== 'result' && (
            <>
              <p className="pb-progress-label">
                {fill(ui.stepTemplate, { current: index + 1, total: 4 })}
              </p>
              <ol
                className="pb-progress"
                aria-label={fill(ui.stepTemplate, {
                  current: index + 1,
                  total: 4,
                })}
              >
                {questions.map((question, item) => (
                  <li
                    key={question}
                    data-complete={item < index}
                    aria-current={view === question ? 'step' : undefined}
                    aria-label={titles[question]}
                  />
                ))}
              </ol>
            </>
          )}
          <div
            className={
              view === 'result' ? 'pb-screen pb-result-screen' : 'pb-screen'
            }
            key={view}
          >
            {view !== 'result' && (
              <>
                <h2 id="pb-step-title" tabIndex={-1} ref={heading}>
                  {ready ? titles[view] : ui.loading}
                </h2>
                <p className="pb-hint pb-question-hint">{hints[view]}</p>
                {session.example && (
                  <p className="pb-example">{ui.exampleTag}</p>
                )}
              </>
            )}
            {view !== 'result' && (
              <form
                noValidate
                onSubmit={submit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && event.repeat)
                    event.preventDefault();
                }}
              >
                {view === 'purpose' && (
                  <>
                    {field('purpose', ui.goalLabel)}
                    {suggestions('purpose', copy.suggestions.purpose)}
                  </>
                )}
                {view === 'obstacle' && (
                  <>
                    <div
                      className="pb-obstacles"
                      role="group"
                      aria-label={flow.obstacleTitle}
                    >
                      {obstacleIds.map((id) => (
                        <button
                          id={id === 'time' ? 'pb-obstacle' : undefined}
                          type="button"
                          data-pb-navigation
                          key={id}
                          aria-pressed={obstacle === id}
                          onClick={() => {
                            if (controller.getSnapshot().view !== 'obstacle')
                              return;
                            controller.update('obstacle', id);
                            setErrors({});
                            if (id !== 'other') go('situation');
                          }}
                        >
                          {copy.obstacles[id]}
                          <Arrow />
                        </button>
                      ))}
                    </div>
                    {obstacle === 'other' &&
                      field('otherObstacle', ui.otherLabel)}
                  </>
                )}
                {view === 'situation' && (
                  <>
                    {field(
                      'situation',
                      `${ui.if} — ${ui.situationLabel}`,
                      true,
                    )}
                    {suggestions(
                      'situation',
                      obstacle && obstacle !== 'other'
                        ? copy.suggestions.situation[obstacle]
                        : [],
                    )}
                  </>
                )}
                {view === 'action' && (
                  <>
                    {field('action', `${ui.then} — ${ui.actionLabel}`, true)}
                    {suggestions(
                      'action',
                      obstacle ? copy.suggestions.action[obstacle] : [],
                    )}
                  </>
                )}
                <div
                  className={`pb-actions ${view === 'purpose' ? 'pb-start-actions' : ''}`}
                >
                  {view !== 'purpose' && (
                    <button
                      type="button"
                      className="pb-secondary"
                      data-pb-navigation
                      onClick={() => go(previous[view])}
                    >
                      {ui.back}
                    </button>
                  )}
                  {(view !== 'obstacle' || obstacle === 'other') && (
                    <button
                      type="submit"
                      className="pb-primary"
                      data-pb-navigation
                      disabled={!ready}
                    >
                      {nextLabels[view]}
                      <Arrow />
                    </button>
                  )}
                  {view === 'purpose' && (
                    <button
                      type="button"
                      className="pb-secondary"
                      data-pb-navigation
                      disabled={!ready}
                      onClick={beginExample}
                    >
                      {ui.exampleButton}
                    </button>
                  )}
                </div>
              </form>
            )}
            {view === 'result' && phrase.ok && (
              <>
                <ExportPanel
                  plan={phrase.value}
                  locale={locale}
                  copy={copy}
                  heading={
                    <>
                      <h2 id="pb-step-title" tabIndex={-1} ref={heading}>
                        {titles.result}
                      </h2>
                      <p className="pb-hint pb-question-hint">{hints.result}</p>
                      {session.example && (
                        <p className="pb-example">{ui.exampleTag}</p>
                      )}
                    </>
                  }
                  onEdit={() => go('action')}
                  calendarEditor={(calendarActions) => (
                    <ScheduleEditor
                      plan={{
                        ...phrase.value,
                        time: inputs.time,
                        days: inputs.days,
                      }}
                      locale={locale}
                      copy={copy}
                      onCommit={controller.commitSchedule}
                      onEdit={controller.markEdited}
                    >
                      {calendarActions}
                    </ScheduleEditor>
                  )}
                />
                <div className="pb-actions">
                  <button
                    type="button"
                    className="pb-secondary"
                    data-pb-navigation
                    onClick={() => {
                      controller.reset();
                      setErrors({});
                    }}
                  >
                    {ui.reset}
                  </button>
                  <a href={`/${locale}/#catalogo`}>{ui.catalogue}</a>
                </div>
              </>
            )}
          </div>
          <div className="pb-privacy">
            <span>{flow.privacyShort}</span>
            <details>
              <summary>{flow.privacyLabel}</summary>
              <p>{ui.privacy}</p>
            </details>
          </div>
        </div>
        {view !== 'result' && <PlanPreview inputs={inputs} copy={copy} />}
      </div>
    </section>
  );
}
