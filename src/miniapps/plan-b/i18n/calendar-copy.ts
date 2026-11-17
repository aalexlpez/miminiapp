import { isLocale, type Locale } from '../../../lib/locales.ts';
import { validateTranslationParity } from '../../../i18n/validation.ts';
import {
  assertCalendarEvent,
  type CalendarEvent,
  type CalendarText,
} from '../domain/calendar.ts';
import { es } from './es.ts';
import { en } from './en.ts';
import { validateText } from '../domain/validation.ts';

validateTranslationParity(es, en);

export function formatCalendarText(
  event: CalendarEvent,
  locale: Locale,
): CalendarText {
  assertCalendarEvent(event);
  return formatPlanText(event.plan, locale);
}

export function formatPlanText(
  plan: CalendarEvent['plan'],
  locale: Locale,
): CalendarText {
  if (!isLocale(locale)) throw new RangeError('Unsupported calendar locale.');
  for (const field of ['purpose', 'situation', 'action'] as const) {
    const result = validateText(field, plan[field]);
    if (!result.ok || result.value !== plan[field])
      throw new RangeError('Invalid plan text.');
  }
  const copy = { es, en }[locale].calendar;
  const insert = (template: string) =>
    template.replace(
      /\{(purpose|situation|action)\}/g,
      (_, field: keyof CalendarEvent['plan']) => plan[field],
    );
  return Object.freeze({
    summary: insert(copy.summary),
    description: insert(copy.description),
  });
}
