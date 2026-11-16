export const textLimits = {
  purpose: { min: 3, max: 80 },
  otherObstacle: { min: 3, max: 60 },
  situation: { min: 3, max: 90 },
  action: { min: 3, max: 90 },
} as const;

export const obstacleIds = [
  'time',
  'motivation',
  'unexpected',
  'overload',
  'forgetting',
  'other',
] as const;
export const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const;
export const defaultDays = ['MO', 'TU', 'WE', 'TH', 'FR'] as const;

export type ObstacleId = (typeof obstacleIds)[number];
export type Weekday = (typeof weekdays)[number];
export type TextField = keyof typeof textLimits;
export interface PlanInputs {
  readonly purpose: string;
  readonly obstacle: ObstacleId;
  readonly otherObstacle: string;
  readonly situation: string;
  readonly action: string;
  /** Empty means no calendar time selected. */
  readonly time: string;
  readonly days: readonly Weekday[];
}

export type ValidationError =
  | 'invalid-type'
  | 'required'
  | 'line-break'
  | 'too-short'
  | 'too-long'
  | 'invalid-choice'
  | 'invalid-time'
  | 'invalid-days'
  | 'days-required';
export type Validation<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ValidationError };

export function codePointLength(text: string): number {
  return Array.from(text).length;
}

export function validateText(
  field: TextField,
  input: unknown,
): Validation<string> {
  if (typeof input !== 'string') return { ok: false, error: 'invalid-type' };
  // Inspect before trim: even a pasted trailing newline must be reported.
  if (/[\r\n\v\f\u0085\u2028\u2029]/u.test(input))
    return { ok: false, error: 'line-break' };
  const value = input.trim();
  const length = codePointLength(value);
  const { min, max } = textLimits[field];
  if (length === 0) return { ok: false, error: 'required' };
  if (length < min) return { ok: false, error: 'too-short' };
  if (length > max) return { ok: false, error: 'too-long' };
  return { ok: true, value };
}

export function validateObstacle(input: unknown): Validation<ObstacleId> {
  return obstacleIds.some((id) => id === input)
    ? { ok: true, value: input as ObstacleId }
    : { ok: false, error: 'invalid-choice' };
}

export function validateTime(input: unknown): Validation<string> {
  return typeof input === 'string' &&
    (input === '' || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(input))
    ? { ok: true, value: input }
    : { ok: false, error: 'invalid-time' };
}

export function validateDays(
  input: unknown,
  timeSelected: boolean,
): Validation<readonly Weekday[]> {
  if (
    !Array.isArray(input) ||
    Array.from(input).some((day) => !weekdays.some((known) => known === day)) ||
    new Set(input).size !== input.length
  )
    return { ok: false, error: 'invalid-days' };
  if (timeSelected && input.length === 0)
    return { ok: false, error: 'days-required' };
  return { ok: true, value: [...input] as Weekday[] };
}

type InputField = keyof PlanInputs;
export type InputErrors = Partial<Record<InputField, ValidationError>>;
export type PlanValidation =
  | { readonly ok: true; readonly value: PlanInputs }
  | { readonly ok: false; readonly errors: InputErrors };

/** A full result requires valid active fields; unfinished steps stay in UI. */
export function validatePlanInputs(input: unknown): PlanValidation {
  const record =
    typeof input === 'object' && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const purpose = validateText('purpose', record.purpose);
  const obstacle = validateObstacle(record.obstacle);
  const otherObstacle =
    obstacle.ok && obstacle.value === 'other'
      ? validateText('otherObstacle', record.otherObstacle)
      : ({ ok: true, value: '' } as const);
  const situation = validateText('situation', record.situation);
  const action = validateText('action', record.action);
  const time = validateTime(record.time);
  const days = validateDays(record.days, time.ok && time.value !== '');
  const fields = {
    purpose,
    obstacle,
    otherObstacle,
    situation,
    action,
    time,
    days,
  };
  const errors: InputErrors = {};
  for (const field of Object.keys(fields) as InputField[]) {
    const result = fields[field];
    if (!result.ok) errors[field] = result.error;
  }
  if (
    purpose.ok &&
    obstacle.ok &&
    otherObstacle.ok &&
    situation.ok &&
    action.ok &&
    time.ok &&
    days.ok
  )
    return {
      ok: true,
      value: {
        purpose: purpose.value,
        obstacle: obstacle.value,
        otherObstacle: otherObstacle.value,
        situation: situation.value,
        action: action.value,
        time: time.value,
        days: days.value,
      },
    };
  return { ok: false, errors };
}
