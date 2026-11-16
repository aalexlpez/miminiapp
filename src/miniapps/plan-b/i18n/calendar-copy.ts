import { isLocale, type Locale } from '../../../lib/locales.ts';
import { validateTranslationParity } from '../../../i18n/validation.ts';
import {
  assertCalendarEvent,
  type CalendarEvent,
  type CalendarText,
} from '../domain/calendar.ts';
import { es } from './es.ts';
import { en } from './en.ts';

validateTranslationParity(es, en);

export function formatCalendarText(
  event: CalendarEvent,
  locale: Locale,
): CalendarText {
  assertCalendarEvent(event);
  if (!isLocale(locale)) throw new RangeError('Unsupported calendar locale.');
  const copy = { es, en }[locale].calendar;
  const insert = (template: string) =>
    template.replace(
      /\{(purpose|situation|action)\}/g,
      (_, field: keyof CalendarEvent['plan']) => event.plan[field],
    );
  return Object.freeze({
    summary: insert(copy.summary),
    description: insert(copy.description),
  });
}
