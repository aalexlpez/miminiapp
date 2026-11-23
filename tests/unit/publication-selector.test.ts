import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  productionRegistry,
  registrations,
} from '../../scripts/publication/registry-source.ts';
import { selectedAssets } from '../../scripts/publication/assets.ts';
import { publicationBuild } from '../../scripts/publication/build.ts';
import type { MiniappRelease } from '../../scripts/publication/manifest.ts';

const source = `import { validateRegistry } from '../lib/miniapp-registry';
import { metadata as a } from './fixture-a/metadata';
import { metadata as b } from './fixture-b/metadata';
import { metadata as draft } from './fixture-draft/metadata';
export const miniappRegistry = validateRegistry([
 { descriptor: a, loadEntry: () => import('./fixture-a/entry.astro') },
 { descriptor: b, loadEntry: () => import('./fixture-b/entry.astro') },
 { descriptor: draft },
] satisfies readonly MiniappRegistration[]);`;
const release: MiniappRelease = {
  schemaVersion: 1,
  releaseId: 'test-a',
  sourceSha: 'a'.repeat(40),
  destinationBaseSha: 'b'.repeat(40),
  miniapps: [{ slug: 'fixture-a', plannedReleaseDate: '2027-01-01' }],
};
const ownership = {
  schemaVersion: 1 as const,
  shared: ['fonts/**', 'favicon.svg'],
  miniapps: {
    'fixture-a': ['brand/fixture-a/**'],
    'fixture-b': ['brand/fixture-b/**'],
  },
};

describe('production registry and asset projection', () => {
  it('preserves one source registry and removes excluded imports before bundling', () => {
    expect(registrations(source)).toEqual([
      { slug: 'fixture-a', published: true },
      { slug: 'fixture-b', published: true },
      { slug: 'fixture-draft', published: false },
    ]);
    const generated = productionRegistry(source, release);
    expect(generated).toContain("import('./fixture-a/entry.astro')");
    expect(generated).toContain('2027-01-01');
    expect(generated).not.toMatch(/fixture-b|fixture-draft/);
    expect(
      productionRegistry(source, { ...release, miniapps: [] }),
    ).not.toContain('/metadata');
  });
  it('reads the current real registry, including its empty production projection', async () => {
    const actual = await readFile(
      new URL('../../src/miniapps/registry.ts', import.meta.url),
      'utf8',
    );
    expect(registrations(actual)).toEqual([
      { slug: 'plan-b', published: true },
    ]);
    expect(
      productionRegistry(actual, { ...release, miniapps: [] }),
    ).not.toContain('plan-b');
  });
  it.each(['fixture-draft', 'unknown'])(
    'rejects an unavailable selection: %s',
    (slug) => {
      expect(() =>
        productionRegistry(source, {
          ...release,
          miniapps: [{ slug, plannedReleaseDate: '2027-01-01' }],
        }),
      ).toThrow('Unknown or draft');
    },
  );
  it.each([
    source.replace('descriptor: a', '...a'),
    source.replace("'./fixture-a/entry.astro'", "'./fixture-b/entry.astro'"),
    source.replace('descriptor: b', 'descriptor: a'),
    source.replace('validateRegistry([', 'arbitraryFunction(['),
    source.replace('descriptor: a', 'descriptor: a, extra: true'),
  ])(
    'fails closed when the registry no longer has the supported static shape',
    (value) => {
      expect(() => registrations(value)).toThrow();
    },
  );
  it('retains shared assets and selected owners only', () => {
    const files = [
      'favicon.svg',
      'fonts/local.woff2',
      'brand/fixture-a/icon.png',
      'brand/fixture-b/icon.png',
    ];
    expect(
      selectedAssets(
        files,
        ownership,
        ['fixture-a', 'fixture-b'],
        ['fixture-a'],
      ),
    ).toEqual(files.slice(0, 3));
    expect(
      selectedAssets(files, ownership, ['fixture-a', 'fixture-b'], []),
    ).toEqual(files.slice(0, 2));
  });
  it('does not confuse an app named shared with platform asset ownership', () => {
    expect(
      selectedAssets(
        ['brand/shared/icon.svg'],
        {
          schemaVersion: 1,
          shared: [],
          miniapps: { shared: ['brand/shared/**'] },
        },
        ['shared'],
        [],
      ),
    ).toEqual([]);
  });
  it('rejects unknown, ambiguous and unsafe asset declarations', () => {
    expect(() =>
      selectedAssets(
        ['unexpected.txt'],
        ownership,
        ['fixture-a', 'fixture-b'],
        [],
      ),
    ).toThrow('exactly one owner');
    expect(() =>
      selectedAssets(
        ['brand/fixture-a/icon.png'],
        { ...ownership, shared: ['brand/**'] },
        ['fixture-a', 'fixture-b'],
        [],
      ),
    ).toThrow('exactly one owner');
    expect(() =>
      selectedAssets(
        [],
        { ...ownership, shared: ['../outside'] },
        ['fixture-a', 'fixture-b'],
        [],
      ),
    ).toThrow('Invalid');
    expect(() => selectedAssets([], ownership, ['fixture-a'], [])).toThrow(
      'Invalid',
    );
  });
  it('does not mistake NODE_ENV=production for the production publication target', async () => {
    expect(
      await publicationBuild('/unreadable', { NODE_ENV: 'production' }),
    ).toEqual({ plugins: [] });
    await expect(
      publicationBuild('/unreadable', { MINIAPP_BUILD_TARGET: 'wrong' }),
    ).rejects.toThrow('Unknown');
    await expect(
      publicationBuild('/unreadable', { MINIAPP_BUILD_TARGET: 'production' }),
    ).rejects.toThrow();
  });
});
