export interface LocalDate {
  readonly year: number;
  /** Calendar month, 1–12. */
  readonly month: number;
  readonly day: number;
}

export interface NarrativeDate {
  readonly startedOn: LocalDate;
  readonly nextMonth: LocalDate;
  readonly isJanuary: boolean;
}

/** Capture once at start/example; keep this value when the clock changes. */
export function captureNarrativeDate(clock: () => Date): NarrativeDate {
  const now = clock();
  if (!Number.isFinite(now.getTime()))
    throw new RangeError('A valid local narrative date is required.');
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return Object.freeze({
    startedOn: Object.freeze({ year, month, day: now.getDate() }),
    nextMonth: Object.freeze({
      year: month === 12 ? year + 1 : year,
      month: month === 12 ? 1 : month + 1,
      day: 1,
    }),
    isJanuary: month === 1,
  });
}
