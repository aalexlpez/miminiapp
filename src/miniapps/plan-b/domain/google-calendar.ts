import {
  assertCalendarEvent,
  assertCalendarText,
  formatFloatingDateTime,
  recurrenceRule,
  type CalendarEvent,
  type CalendarText,
} from './calendar.ts';

/** Returns a template URL only; opening it requires the later consent flow. */
export function googleCalendarUrl(
  event: CalendarEvent,
  text: CalendarText,
): string {
  assertCalendarEvent(event);
  assertCalendarText(text);
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', text.summary);
  url.searchParams.set('details', text.description);
  url.searchParams.set(
    'dates',
    `${formatFloatingDateTime(event.start)}/${formatFloatingDateTime(event.end)}`,
  );
  url.searchParams.set('recur', `RRULE:${recurrenceRule(event)}`);
  return url.href;
}
