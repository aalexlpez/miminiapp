import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCalendarEvent } from '../../domain/calendar.ts';
import { serializeIcalendar } from '../../domain/icalendar.ts';
import { googleCalendarUrl } from '../../domain/google-calendar.ts';
import { formatCalendarText } from '../../i18n/calendar-copy.ts';

/** Synthetic examples only. Never reads a saved plan or opens a destination. */
export async function writeCalendarSamples(directory: string) {
  await mkdir(directory, { recursive: true });
  const urls: Record<string, string> = {};
  for (const locale of ['es', 'en'] as const) {
    const model = createCalendarEvent(
      {
        purpose:
          locale === 'es'
            ? 'Hacer ejercicio 3 veces por semana'
            : 'Exercise 3 times a week',
        situation:
          locale === 'es'
            ? 'llego a casa después de las 20:00'
            : 'I get home after 8 p.m.',
        action:
          locale === 'es'
            ? 'hago 5 minutos de estiramientos antes de sentarme en el sofá'
            : 'I do 5 minutes of stretching before I sit on the couch',
        obstacle: 'time',
        otherObstacle: '',
        time: '20:00',
        days: ['MO', 'TU', 'WE', 'TH', 'FR'],
      },
      new Date(2026, 10, 15, 12),
      `00000000-0000-4000-8000-00000000000${locale === 'es' ? '1' : '2'}`,
    );
    const copy = formatCalendarText(model, locale);
    await writeFile(
      resolve(directory, locale === 'es' ? 'plan-b.ics' : 'bad-day-plan.ics'),
      serializeIcalendar(model, copy),
    );
    urls[locale] = googleCalendarUrl(model, copy);
  }
  await writeFile(
    resolve(directory, 'calendar-urls.json'),
    JSON.stringify(urls, null, 2) + '\n',
  );
  await writeFile(
    resolve(directory, 'README.txt'),
    'Synthetic I2 samples. Not a mobile download/import test. No Google request performed. Floating local times; new real exports require fresh UIDs.\n',
  );
  return urls;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (!process.argv[2])
    throw new Error('Pass an output directory for synthetic calendar samples.');
  await writeCalendarSamples(process.argv[2]);
}
