import type { Locale } from '../../../lib/locales';
import { createCalendarEvent } from '../domain/calendar';
import { serializeIcalendar } from '../domain/icalendar';
import { googleCalendarUrl } from '../domain/google-calendar';
import { formatCalendarText } from '../i18n/calendar-copy';

export function calendarExport(input: unknown, locale: Locale) {
  const event = createCalendarEvent(input, new Date(), crypto.randomUUID());
  const text = formatCalendarText(event, locale);
  return { event, text };
}
export function calendarFile(input: unknown, locale: Locale) {
  const { event, text } = calendarExport(input, locale);
  return new Blob([serializeIcalendar(event, text)], {
    type: 'text/calendar;charset=utf-8',
  });
}
export function cleanToolUrl(locale: Locale) {
  return new URL(`/${locale}/apps/plan-b/`, window.location.origin).href;
}
export function isShareCancellation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

/** Defer revocation for downloads; dispose all outstanding URLs on leaving result. */
export function createDownloads() {
  const pending = new Map<string, ReturnType<typeof setTimeout>>();
  function release(url: string) {
    clearTimeout(pending.get(url));
    pending.delete(url);
    URL.revokeObjectURL(url);
  }
  return {
    save(blob: Blob, filename: string) {
      const url = URL.createObjectURL(blob);
      pending.set(
        url,
        setTimeout(() => release(url), 60_000),
      );
      const anchor = document.createElement('a');
      try {
        anchor.href = url;
        anchor.download = filename;
        document.body.append(anchor);
        anchor.click();
      } catch (error) {
        release(url);
        throw error;
      } finally {
        anchor.remove();
      }
    },
    dispose() {
      for (const url of pending.keys()) release(url);
    },
  };
}

/** A detectable blank popup first; sever its opener before attaching any plan data. */
export function openGoogleCalendar(input: unknown, locale: Locale): boolean {
  const { event, text } = calendarExport(input, locale);
  const url = googleCalendarUrl(event, text);
  const popup = window.open('about:blank', '_blank');
  if (!popup) return false;
  try {
    popup.opener = null;
    const link = popup.document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.rel = 'noopener noreferrer';
    link.referrerPolicy = 'no-referrer';
    popup.document.body.append(link);
    link.click();
    link.remove();
    return true;
  } catch {
    popup.close();
    return false;
  }
}
