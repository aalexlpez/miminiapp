import {
  assertCalendarEvent,
  assertCalendarText,
  formatFloatingDateTime,
  recurrenceRule,
  type CalendarEvent,
  type CalendarText,
} from './calendar.ts';

/** TEXT escaping is separate from content-line folding. */
export function escapeCalendarText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function fold(line: string): string {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let chunk = '';
  let size = 0;
  for (const point of line) {
    const width = encoder.encode(point).length;
    if (size + width > 75) {
      chunks.push(chunk);
      chunk = ' ';
      size = 1;
    }
    chunk += point;
    size += width;
  }
  chunks.push(chunk);
  return chunks.join('\r\n');
}

export function serializeIcalendar(
  event: CalendarEvent,
  text: CalendarText,
): string {
  assertCalendarEvent(event);
  assertCalendarText(text);
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MiMiniApp//Plan B//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${event.dtstamp}`,
      `DTSTART:${formatFloatingDateTime(event.start)}`,
      `DTEND:${formatFloatingDateTime(event.end)}`,
      `RRULE:${recurrenceRule(event)}`,
      `SUMMARY:${escapeCalendarText(text.summary)}`,
      `DESCRIPTION:${escapeCalendarText(text.description)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeCalendarText(text.summary)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .map(fold)
      .join('\r\n') + '\r\n'
  );
}
