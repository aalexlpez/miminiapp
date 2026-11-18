import { test as base, expect } from '../../../../../tests/e2e/fixtures';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  createIsolatedBuild,
  fileHashes,
  projectRoot,
  protectedHashes,
  type IsolatedBuild,
  type IsolatedVariant,
  type EntryKind,
} from './isolated-build';

export const test = base.extend<
  { variant: IsolatedVariant },
  {
    isolatedBuilds: Record<IsolatedVariant, IsolatedBuild>;
    entryKind: EntryKind;
  }
>({
  variant: ['published', { option: true }],
  entryKind: ['fixture', { option: true, scope: 'worker' }],
  isolatedBuilds: [
    async ({ browserName, entryKind }, provide) => {
      const before = await protectedHashes();
      const owned: IsolatedBuild[] = [];
      try {
        const draft = await createIsolatedBuild('draft', entryKind);
        owned.push(draft);
        const published = await createIsolatedBuild('published', entryKind);
        owned.push(published);
        const simultaneous = await Promise.all([
          published.startPreview(),
          published.startPreview(),
        ]);
        expect(simultaneous[0]).toBe(simultaneous[1]);
        for (const build of owned) {
          const copiedSource = await fileHashes(path.join(build.root, 'src'));
          for (const [filename, hash] of Object.entries(before.source)) {
            if (
              filename === 'miniapps/registry.ts' ||
              filename === 'miniapps/plan-b/entry.astro'
            )
              continue;
            expect(
              copiedSource[filename],
              `Source changed in copy: ${filename}`,
            ).toBe(hash);
          }
          expect(copiedSource['miniapps/plan-b/entry.astro']).toBe(
            before.source[
              entryKind === 'fixture'
                ? 'miniapps/plan-b/tests/fixtures/entry.astro.fixture'
                : 'miniapps/plan-b/entry.astro'
            ],
          );
          expect(
            Object.keys(copiedSource).filter(
              (filename) => !(filename in before.source),
            ),
          ).toEqual(
            before.source['miniapps/plan-b/entry.astro']
              ? []
              : ['miniapps/plan-b/entry.astro'],
          );
        }
        for (const filename of Object.keys(before.output)) {
          const text = (
            await readFile(path.join(projectRoot, 'dist', filename))
          ).toString();
          for (const marker of ['PB_I1_ISOLATED_FIXTURE']) {
            expect(filename).not.toContain(marker);
            expect(text).not.toContain(marker);
          }
        }
        for (const locale of ['es', 'en']) {
          expect(Object.keys(before.output)).toContain(
            `${locale}/apps/plan-b/index.html`,
          );
        }
        await provide({ draft, published });
      } finally {
        const cleanup = await Promise.allSettled(
          owned.map((build) => build.close()),
        );
        expect(
          await protectedHashes(),
          `Fixture changed the real source or public build (${browserName})`,
        ).toEqual(before);
        expect(
          cleanup.filter((result) => result.status === 'rejected'),
        ).toEqual([]);
      }
    },
    { scope: 'worker', timeout: 120_000 },
  ],
  baseURL: async ({ isolatedBuilds, variant }, provide) => {
    await provide(await isolatedBuilds[variant].startPreview());
  },
});

export { expect };
