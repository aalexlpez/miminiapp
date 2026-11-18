import { useRef, useState, type ReactNode } from 'react';
import type { Locale } from '../../lib/locales';
import { fill } from './i18n/fill';
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
  onExport,
}: {
  plan: PlanInputs;
  locale: Locale;
  copy: PlanCopy;
  onCommit: (time: string, days: readonly Weekday[]) => boolean;
  onEdit: () => void;
  children?: ReactNode;
  onExport: (input: PlanInputs, kind: 'ics' | 'google') => void;
}) {
  const [time, setTime] = useState(plan.time);
  const [days, setDays] = useState<readonly Weekday[]>([...plan.days]);
  const [error, setError] = useState<'time' | 'days' | null>(null);
  const [notice, setNotice] = useState('');
  const [dirty, setDirty] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  function prepare(kind: 'ics' | 'google' = 'ics') {
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
      setNotice('');
      onExport({ ...plan, time, days: [...days] }, kind);
    }
  }
  function name(day: Weekday, short = false) {
    return new Intl.DateTimeFormat(locale, {
      weekday: short ? 'short' : 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 10, 16 + weekdays.indexOf(day))));
  }
  const validSchedule =
    !!time && validateTime(time).ok && validateDays(days, true).ok;
  const [hour, minute] = time.split(':').map(Number);
  const formattedTime = validSchedule
    ? new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(2026, 0, 1, hour, minute)))
    : '';
  const formattedDays =
    days.length === 7
      ? copy.ui.allDays
      : days.length === 5 &&
          weekdays.slice(0, 5).every((day) => days.includes(day))
        ? copy.ui.workingDays
        : days.map((day) => name(day, true)).join(', ');
  return (
    <form
      className="pb-schedule"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        prepare();
      }}
    >
      <p className="pb-hint" id="pb-schedule-hint">
        {copy.flow.calendarHint}
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
        <div className="pb-day-presets">
          {[
            { label: copy.ui.allDays, values: weekdays },
            { label: copy.ui.workingDays, values: weekdays.slice(0, 5) },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={
                days.length === preset.values.length &&
                preset.values.every((day) => days.includes(day))
              }
              onClick={() => {
                onEdit();
                setDays([...preset.values]);
                setDirty(true);
                setError(null);
                setNotice('');
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
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
      {validSchedule && (
        <p id="pb-calendar-summary" role="status">
          {fill(copy.ui.calendarSummary, {
            days: formattedDays,
            time: formattedTime,
          })}
        </p>
      )}
      <div className="pb-actions">
        <button data-pb-export type="submit" className="pb-primary">
          {copy.exports.calendarDownload}
        </button>
        <button data-pb-export type="button" onClick={() => prepare('google')}>
          {copy.exports.google}
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
      {time && !dirty && (
        <p className="pb-hint">{copy.exports.duplicateWarning}</p>
      )}
      {!dirty && children}
    </form>
  );
}
