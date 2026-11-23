import { describe, expect, it } from 'vitest';
import {
  addToRelease,
  readRelease,
  releaseText,
  validateRelease,
  type MiniappRelease,
} from '../../scripts/publication/manifest.ts';

const a = 'a'.repeat(40);
const b = 'b'.repeat(40);
const empty: MiniappRelease = {
  schemaVersion: 1,
  releaseId: 'test-empty',
  sourceSha: a,
  destinationBaseSha: b,
  miniapps: [],
};
const request = {
  releaseId: 'test-1',
  sourceSha: a,
  destinationBaseSha: b,
  expectedBaseSha: b,
  plannedReleaseDate: '2027-01-01',
  addMiniapps: ['fixture-a'],
  candidates: ['fixture-a', 'fixture-b'],
};

describe('selective release data contract', () => {
  it('accepts an explicit empty catalogue and preserves the serialized contract', () => {
    expect(readRelease(releaseText(empty))).toEqual(empty);
  });
  it.each([
    undefined,
    null,
    {},
    { ...empty, schemaVersion: 2 },
    { ...empty, sourceSha: 'main' },
    { ...empty, releaseId: '../main' },
    { ...empty, destinationBaseSha: b.toUpperCase() },
    { ...empty, secret: 'not-allowed' },
    {
      ...empty,
      miniapps: [{ slug: 'fixture-a', plannedReleaseDate: '2027-02-30' }],
    },
    {
      ...empty,
      miniapps: [{ slug: '../escape', plannedReleaseDate: '2027-01-01' }],
    },
    {
      ...empty,
      miniapps: Array(2).fill({
        slug: 'fixture-a',
        plannedReleaseDate: '2027-01-01',
      }),
    },
  ])('rejects malformed or ambiguous manifests: %j', (value) => {
    expect(() => validateRelease(value)).toThrow();
  });
  it('accumulates additions and preserves the first planned public date', () => {
    const first = addToRelease(empty, request);
    const second = addToRelease(first, {
      ...request,
      releaseId: 'test-2',
      plannedReleaseDate: '2027-01-08',
      addMiniapps: ['fixture-b'],
    });
    expect(second.miniapps).toEqual([
      { slug: 'fixture-a', plannedReleaseDate: '2027-01-01' },
      { slug: 'fixture-b', plannedReleaseDate: '2027-01-08' },
    ]);
    expect(empty.miniapps).toEqual([]);
  });
  it('is idempotent when repeating additions or requesting no additions', () => {
    const first = addToRelease(empty, request);
    expect(
      addToRelease(first, {
        ...request,
        releaseId: 'another-id',
        plannedReleaseDate: '2027-01-08',
      }),
    ).toEqual(first);
    expect(addToRelease(first, { ...request, addMiniapps: [] })).toEqual(first);
  });
  it('allows a new snapshot for corrections without removing published applications', () => {
    const first = addToRelease(empty, request);
    const next = addToRelease(first, {
      ...request,
      releaseId: 'test-fix',
      sourceSha: 'c'.repeat(40),
      addMiniapps: [],
    });
    expect(next.miniapps).toEqual(first.miniapps);
    expect(next.sourceSha).toBe('c'.repeat(40));
  });
  it('rejects a stale destination base and conflicting reuse of a release ID', () => {
    expect(() =>
      addToRelease(empty, { ...request, expectedBaseSha: a }),
    ).toThrow('base changed');
    expect(() =>
      addToRelease(empty, { ...request, releaseId: empty.releaseId }),
    ).toThrow('identifier already used');
  });
  it('rejects unknown/draft applications, duplicates and loss of a published app from the source', () => {
    expect(() =>
      addToRelease(empty, { ...request, addMiniapps: ['unknown'] }),
    ).toThrow('Unknown or draft');
    expect(() =>
      addToRelease(empty, {
        ...request,
        addMiniapps: ['fixture-a', 'fixture-a'],
      }),
    ).toThrow('Duplicate');
    expect(() =>
      addToRelease(addToRelease(empty, request), {
        ...request,
        candidates: ['fixture-b'],
        addMiniapps: [],
      }),
    ).toThrow('Unknown or draft');
  });
});
