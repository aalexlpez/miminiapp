/** Data only: safe to validate without importing a miniapp or executing its UI. */
export interface MiniappRelease {
  schemaVersion: 1;
  releaseId: string;
  sourceSha: string;
  destinationBaseSha: string;
  miniapps: { slug: string; plannedReleaseDate: string }[];
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const shaPattern = /^[a-f0-9]{40}$/;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).sort().join(',') === keys.sort().join(',');
}

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function validateRelease(
  value: unknown,
): asserts value is MiniappRelease {
  if (
    !record(value) ||
    !exactKeys(value, [
      'schemaVersion',
      'releaseId',
      'sourceSha',
      'destinationBaseSha',
      'miniapps',
    ]) ||
    value.schemaVersion !== 1 ||
    typeof value.releaseId !== 'string' ||
    value.releaseId.length > 80 ||
    !slugPattern.test(value.releaseId) ||
    typeof value.sourceSha !== 'string' ||
    !shaPattern.test(value.sourceSha) ||
    typeof value.destinationBaseSha !== 'string' ||
    !shaPattern.test(value.destinationBaseSha) ||
    !Array.isArray(value.miniapps)
  )
    throw new Error('Invalid miniapp release manifest.');
  const seen = new Set<string>();
  for (const entry of value.miniapps) {
    if (
      !record(entry) ||
      !exactKeys(entry, ['slug', 'plannedReleaseDate']) ||
      typeof entry.slug !== 'string' ||
      !slugPattern.test(entry.slug) ||
      seen.has(entry.slug) ||
      !isCalendarDate(entry.plannedReleaseDate)
    )
      throw new Error('Invalid or duplicate miniapp release entry.');
    seen.add(entry.slug);
  }
}

export function readRelease(text: string): MiniappRelease {
  const value: unknown = JSON.parse(text);
  validateRelease(value);
  return value;
}

export function releaseText(value: MiniappRelease) {
  validateRelease(value);
  return `${JSON.stringify({ ...value, miniapps: [...value.miniapps].sort((a, b) => a.slug.localeCompare(b.slug, 'en')) }, null, 2)}\n`;
}

/** All previous entries survive; removal is deliberately outside this API. */
export function addToRelease(
  previous: MiniappRelease,
  request: {
    releaseId: string;
    sourceSha: string;
    destinationBaseSha: string;
    expectedBaseSha: string;
    plannedReleaseDate: string;
    addMiniapps: string[];
    candidates: readonly string[];
  },
): MiniappRelease {
  validateRelease(previous);
  if (request.destinationBaseSha !== request.expectedBaseSha)
    throw new Error('Production base changed; prepare the candidate again.');
  if (!isCalendarDate(request.plannedReleaseDate))
    throw new Error('Invalid release date.');
  if (new Set(request.addMiniapps).size !== request.addMiniapps.length)
    throw new Error('Duplicate requested miniapp.');
  const entries = new Map(
    previous.miniapps.map((entry) => [entry.slug, { ...entry }]),
  );
  for (const slug of [...entries.keys(), ...request.addMiniapps]) {
    if (!request.candidates.includes(slug))
      throw new Error(`Unknown or draft miniapp: ${slug}`);
  }
  for (const slug of request.addMiniapps) {
    if (!entries.has(slug))
      entries.set(slug, {
        slug,
        plannedReleaseDate: request.plannedReleaseDate,
      });
  }
  const next: MiniappRelease = {
    schemaVersion: 1,
    releaseId: request.releaseId,
    sourceSha: request.sourceSha,
    destinationBaseSha: request.destinationBaseSha,
    miniapps: [...entries.values()].sort((a, b) =>
      a.slug.localeCompare(b.slug, 'en'),
    ),
  };
  validateRelease(next);
  const sameSelection =
    JSON.stringify(next.miniapps) ===
    JSON.stringify(
      [...previous.miniapps].sort((a, b) => a.slug.localeCompare(b.slug, 'en')),
    );
  if (sameSelection && previous.sourceSha === next.sourceSha)
    return structuredClone(previous);
  if (previous.releaseId === next.releaseId)
    throw new Error('Release identifier already used for different content.');
  return next;
}
