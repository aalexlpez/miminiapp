import { useRef, useState, type SubmitEvent, type ReactNode } from 'react';
import type { Locale } from '../../lib/locales';
import type { PlanCopy } from './i18n/copy';
import {
  validateDays,
  validateTime,
  weekdays,
  type PlanInputs,
  type Weekday,
} from './domain/validation';

/** Draft schedule never reaches the v1 result until both native/domain checks pass. */
export default function ScheduleEditor({
  plan,
  locale,
  copy,
  onCommit,
  onEdit,
  children,
}: {
  plan: PlanInputs;
  locale: Locale;
  copy: PlanCopy;
  onCommit: (time: string, days: readonly Weekday[]) => boolean;
  onEdit: () => void;
  children: ReactNode;
}) {
  const [time, setTime] = useState(plan.time);
  const [days, setDays] = useState<readonly Weekday[]>([...plan.days]);
  const [error, setError] = useState<'time' | 'days' | null>(null);
  const [notice, setNotice] = useState('');
  const [dirty, setDirty] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  function prepare(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!time || input.current?.validity.badInput || !validateTime(time).ok) {
      setError('time');
      input.current?.focus();
      return;
    }
    if (!validateDays(days, true).ok) {
      setError('days');
      document.getElementById('pb-day-MO')?.focus();
      return;
    }
    if (onCommit(time, days)) {
      setError(null);
      setDirty(false);
      setNotice(copy.flow.scheduleReady);
    }
  }
  function name(day: Weekday, short = false) {
    return new Intl.DateTimeFormat(locale, {
      weekday: short ? 'short' : 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 10, 16 + weekdays.indexOf(day))));
  }
  return (
    <form className="pb-schedule" noValidate onSubmit={prepare}>
      <p className="pb-hint">{copy.flow.calendarHint}</p>
      <p className="pb-hint" id="pb-schedule-hint">
        {copy.flow.scheduleHint}
      </p>
      <div className="pb-field">
        <label htmlFor="pb-time">{copy.ui.timeQuestion}</label>
        <input
          id="pb-time"
          name="time"
          ref={input}
          type="time"
          value={time}
          aria-invalid={error === 'time'}
          aria-describedby={
            error === 'time'
              ? 'pb-schedule-hint pb-time-error'
              : 'pb-schedule-hint'
          }
          onChange={(event) => {
            if (event.target.value !== time) onEdit();
            setTime(event.target.value);
            setDirty(true);
            setError(null);
            setNotice('');
          }}
        />
        {error === 'time' && (
          <p id="pb-time-error" role="alert" className="pb-error">
            {copy.ui.errorTime}
          </p>
        )}
      </div>
      <fieldset
        aria-describedby={error === 'days' ? 'pb-days-error' : undefined}
      >
        <legend>{copy.ui.daysLabel}</legend>
        <div className="pb-days">
          {weekdays.map((day) => (
            <button
              id={`pb-day-${day}`}
              key={day}
              type="button"
              aria-label={name(day)}
              aria-pressed={days.includes(day)}
              onClick={() => {
                onEdit();
                setDays(
                  weekdays.filter((item) =>
                    item === day ? !days.includes(item) : days.includes(item),
                  ),
                );
                setDirty(true);
                setError(null);
                setNotice('');
              }}
            >
              {name(day, true)}
            </button>
          ))}
        </div>
        {error === 'days' && (
          <p role="alert" id="pb-days-error" className="pb-error">
            {copy.ui.errorDays}
          </p>
        )}
      </fieldset>
      <div className="pb-actions">
        <button type="submit" className="pb-primary">
          {copy.flow.schedulePrepare}
        </button>
        <button
          type="button"
          onClick={() => {
            if (onCommit('', days)) {
              setTime('');
              if (input.current) input.current.value = '';
              setError(null);
              setDirty(false);
              setNotice(copy.flow.scheduleCleared);
            }
          }}
        >
          {copy.flow.scheduleWithoutTime}
        </button>
      </div>
      <p role="status" aria-atomic="true">
        {notice}
      </p>
      {!dirty && children}
    </form>
  );
}
