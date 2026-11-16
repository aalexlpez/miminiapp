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
import type { Step } from './domain/session-state';
import {
  codePointLength,
  defaultDays,
  obstacleIds,
  textLimits,
  validatePlanInputs,
  validateText,
  weekdays,
  type InputErrors,
  type TextField,
  type ValidationError,
  type Weekday,
} from './domain/validation';
import { fill, type PlanCopy } from './i18n/copy';
import { formatPlanText } from './i18n/calendar-copy';

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
  const { session, ready, memoryOnly, warnings } = snapshot;
  const { inputs, step } = session;
  const [errors, setErrors] = useState<InputErrors>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const lastStep = useRef<Step | null>(null);
  const focusTime = useRef(false);
  const otherInput = useRef<HTMLInputElement>(null);
  const ui = copy.ui;
  useEffect(() => {
    controller.initialize();
  }, [controller]);
  useEffect(() => {
    if (!ready || lastStep.current === step) return;
    const previous = lastStep.current;
    lastStep.current = step;
    if (previous === null && step === 'home') return;
    const target = focusTime.current
      ? document.getElementById('pb-time')
      : heading.current;
    focusTime.current = false;
    target?.focus();
  }, [ready, step]);
  useEffect(() => {
    if (step === 'obstacle' && inputs.obstacle === 'other')
      otherInput.current?.focus();
  }, [step, inputs.obstacle]);
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
  function monthName(month: number, year: number) {
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, 1);
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC',
    }).format(date);
  }
  const nextMonth = narrative
    ? monthName(narrative.nextMonth.month, narrative.nextMonth.year)
    : '';
  const title =
    step === 'home'
      ? ready
        ? fill(ui.headline, { month: nextMonth })
        : ui.loading
      : step === 'purpose'
        ? narrative?.isJanuary
          ? ui.januaryQuestion
          : ui.question
        : step === 'obstacle'
          ? fill(ui.obstacleQuestion, { month: nextMonth })
          : step === 'plan'
            ? ui.planTitle
            : ui.planLabel;
  const validation = validatePlanInputs(inputs);
  const obstacle = inputs.obstacle;
  const activeSuggestions =
    obstacle && obstacle !== 'other'
      ? copy.suggestions.situation[obstacle]
      : [];
  function message(error: ValidationError, field: keyof InputErrors) {
    if (error === 'line-break') return ui.errorLine;
    if (field === 'time') return ui.errorTime;
    if (field === 'days') return ui.errorDays;
    if (field === 'obstacle') return ui.errorObstacle;
    if (error === 'required' || error === 'invalid-type')
      return ui.errorRequired;
    const limits = textLimits[field as TextField];
    return limits
      ? fill(ui.errorLength, { min: limits.min, max: limits.max })
      : ui.errorRequired;
  }
  function go(next: Step) {
    setErrors({});
    controller.go(next);
  }
  function begin(example = false) {
    setErrors({});
    controller.begin(
      example
        ? {
            ...copy.example,
            obstacle: 'time',
            otherObstacle: '',
            time: '20:00',
            days: [...defaultDays],
          }
        : undefined,
    );
    if (step === 'purpose') heading.current?.focus();
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
    let found: InputErrors = {};
    if (step === 'purpose') {
      const checked = validateText('purpose', inputs.purpose);
      if (!checked.ok) found = { purpose: checked.error };
    } else if (step === 'obstacle') {
      if (!obstacle) found = { obstacle: 'invalid-choice' };
      else if (obstacle === 'other') {
        const checked = validateText('otherObstacle', inputs.otherObstacle);
        if (!checked.ok) found = { otherObstacle: checked.error };
      }
    } else if (step === 'plan' && !validation.ok) found = validation.errors;
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      const first = Object.keys(found)[0];
      document
        .getElementById(first === 'days' ? 'pb-day-MO' : `pb-${first}`)
        ?.focus();
      return;
    }
    if (step === 'purpose') go('obstacle');
    else if (step === 'obstacle') go('plan');
    else if (step === 'plan') go('result');
  }
  function field(
    name: TextField,
    label: string,
    hint?: string,
    multiline = false,
  ) {
    const count = codePointLength(inputs[name].trim());
    const showCount = count >= textLimits[name].max - 20;
    const describedBy =
      [
        hint ? `pb-${name}-hint` : '',
        showCount ? `pb-${name}-count` : '',
        errors[name] ? `pb-${name}-error` : '',
      ]
        .filter(Boolean)
        .join(' ') || undefined;
    const props = {
      id: `pb-${name}`,
      name,
      value: inputs[name],
      autoComplete: 'off',
      'aria-invalid': !!errors[name],
      'aria-describedby': describedBy,
      onChange: (event: { target: { value: string } }) =>
        changeText(name, event.target.value),
      onPaste: (
        event: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => paste(event, name),
    };
    return (
      <div className="pb-field">
        <label htmlFor={props.id}>{label}</label>
        {hint && (
          <p id={`pb-${name}-hint`} className="pb-hint">
            {hint}
          </p>
        )}
        {multiline ? (
          <textarea {...props} rows={2} dir="auto" />
        ) : (
          <input
            {...props}
            ref={name === 'otherObstacle' ? otherInput : undefined}
            type="text"
            dir="auto"
            placeholder={
              name === 'otherObstacle' ? ui.otherPlaceholder : undefined
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
      <div className="pb-suggestions">
        {values.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => changeText(name, value)}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }
  function dayName(day: Weekday, short = false) {
    return new Intl.DateTimeFormat(locale, {
      weekday: short ? 'short' : 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 10, 16 + weekdays.indexOf(day))));
  }
  function scheduleSummary() {
    const days =
      inputs.days.length === 7
        ? ui.allDays
        : defaultDays.every((day) => inputs.days.includes(day)) &&
            inputs.days.length === 5
          ? ui.workingDays
          : inputs.days.map((day) => dayName(day, true)).join(', ');
    const [hour, minute] = inputs.time.split(':').map(Number);
    const time = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 0, 1, hour, minute)));
    return fill(ui.calendarSummary, { days, time });
  }
  return (
    <section
      className="pb-app"
      data-testid="plan-b-app"
      data-ready={ready}
      aria-labelledby="pb-step-title"
    >
      <aside role="status" aria-atomic="true" className="pb-notices">
        {memoryOnly && <p>{ui.memory}</p>}
        {warnings.includes('invalid') && step === 'home' && <p>{ui.invalid}</p>}
        {warnings.includes('delete-failed') && <p>{ui.deleteFailed}</p>}
      </aside>
      {session.example && <p className="pb-example">{ui.exampleTag}</p>}
      {['purpose', 'obstacle', 'plan'].includes(step) && (
        <p className="pb-step">
          {fill(ui.stepTemplate, {
            current: ['purpose', 'obstacle', 'plan'].indexOf(step) + 1,
            total: 3,
          })}
        </p>
      )}
      <h2 id="pb-step-title" tabIndex={-1} ref={heading}>
        {title}
      </h2>
      {step !== 'home' && narrative && (
        <p className="pb-month">
          {ui.monthLabel}:{' '}
          {step === 'purpose'
            ? monthName(narrative.startedOn.month, narrative.startedOn.year)
            : nextMonth}
        </p>
      )}
      <form noValidate onSubmit={submit}>
        {step === 'home' && (
          <>
            <p>{ui.subtitle}</p>
            <div className="pb-actions">
              <button type="button" disabled={!ready} onClick={() => begin()}>
                {ui.start}
              </button>
              <button
                type="button"
                disabled={!ready}
                onClick={() => begin(true)}
              >
                {ui.exampleButton}
              </button>
            </div>
          </>
        )}
        {step === 'purpose' && (
          <>
            {field('purpose', ui.goalLabel)}
            {suggestions('purpose', copy.suggestions.purpose)}
          </>
        )}
        {step === 'obstacle' && (
          <>
            <p id="pb-obstacle-hint">{ui.obstacleHint}</p>
            <div
              className="pb-obstacles"
              role="group"
              aria-describedby="pb-obstacle-hint"
              aria-label={fill(ui.obstacleQuestion, { month: nextMonth })}
            >
              {obstacleIds.map((id) => (
                <button
                  id={id === 'time' ? 'pb-obstacle' : undefined}
                  type="button"
                  key={id}
                  aria-pressed={obstacle === id}
                  onClick={() => {
                    controller.update('obstacle', id);
                    setErrors({});
                    if (id !== 'other') go('plan');
                  }}
                >
                  {copy.obstacles[id]}
                </button>
              ))}
            </div>
            {errors.obstacle && (
              <p role="alert" className="pb-error">
                {ui.errorObstacle}
              </p>
            )}
            {obstacle === 'other' && field('otherObstacle', ui.otherLabel)}
          </>
        )}
        {step === 'plan' && (
          <>
            {field(
              'situation',
              `${ui.if} — ${ui.situationLabel}`,
              ui.situationHint,
              true,
            )}
            {suggestions('situation', activeSuggestions)}
            {field(
              'action',
              `${ui.then} — ${ui.actionLabel}`,
              ui.actionHint,
              true,
            )}
            {suggestions(
              'action',
              obstacle ? copy.suggestions.action[obstacle] : [],
            )}
            <div className="pb-field">
              <label htmlFor="pb-time">{ui.timeQuestion}</label>
              <p className="pb-hint" id="pb-time-hint">
                {ui.timeHint}
              </p>
              <input
                id="pb-time"
                type="time"
                value={inputs.time}
                aria-describedby={
                  errors.time ? 'pb-time-hint pb-time-error' : 'pb-time-hint'
                }
                aria-invalid={!!errors.time}
                onChange={(event) => {
                  controller.update('time', event.target.value);
                  setErrors((current) => ({
                    ...current,
                    time: undefined,
                    days: undefined,
                  }));
                }}
              />
              {errors.time && (
                <p id="pb-time-error" role="alert" className="pb-error">
                  {ui.errorTime}
                </p>
              )}
            </div>
            <fieldset
              aria-describedby={errors.days ? 'pb-days-error' : undefined}
            >
              <legend>{ui.daysLabel}</legend>
              <div className="pb-days">
                {weekdays.map((day) => (
                  <button
                    id={`pb-day-${day}`}
                    key={day}
                    type="button"
                    aria-label={dayName(day)}
                    aria-pressed={inputs.days.includes(day)}
                    onClick={() => {
                      controller.update(
                        'days',
                        weekdays.filter((item) =>
                          item === day
                            ? !inputs.days.includes(item)
                            : inputs.days.includes(item),
                        ),
                      );
                      setErrors((current) => ({ ...current, days: undefined }));
                    }}
                  >
                    {dayName(day, true)}
                  </button>
                ))}
              </div>
              {errors.days && (
                <p id="pb-days-error" role="alert" className="pb-error">
                  {ui.errorDays}
                </p>
              )}
            </fieldset>
          </>
        )}
        {step === 'result' && validation.ok && (
          <>
            <p className="pb-stamp">{fill(ui.stamp, { month: nextMonth })}</p>
            <p className="pb-result" data-testid="plan-sentence">
              {
                formatPlanText(validation.value, locale).description.split(
                  '\n',
                  1,
                )[0]
              }
            </p>
            <p className="pb-goal">
              {ui.goalLabel}: {validation.value.purpose}
            </p>
            {inputs.time ? (
              <>
                <p>{scheduleSummary()}</p>
                <p className="pb-hint">{ui.calendarHint}</p>
              </>
            ) : (
              <>
                <p>{ui.noTime}</p>
                <button
                  type="button"
                  onClick={() => {
                    focusTime.current = true;
                    go('plan');
                  }}
                >
                  {ui.addTime}
                </button>
              </>
            )}
            <div className="pb-actions">
              <button
                type="button"
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
        {step !== 'home' && (
          <div className="pb-actions">
            <button
              type="button"
              onClick={() =>
                go(
                  (
                    {
                      purpose: 'home',
                      obstacle: 'purpose',
                      plan: 'obstacle',
                      result: 'plan',
                    } as const
                  )[step as Exclude<Step, 'home'>],
                )
              }
            >
              {ui.back}
            </button>
            {(step === 'purpose' ||
              (step === 'obstacle' && obstacle === 'other') ||
              step === 'plan') && (
              <button type="submit">
                {step === 'plan' ? ui.viewPlan : ui.next}
              </button>
            )}
          </div>
        )}
      </form>
      <p className="pb-privacy">{ui.privacy}</p>
    </section>
  );
}
