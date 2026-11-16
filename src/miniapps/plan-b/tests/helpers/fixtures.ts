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
} from './isolated-build';

export const test = base.extend<
  { variant: IsolatedVariant },
  { isolatedBuilds: Record<IsolatedVariant, IsolatedBuild> }
>({
  variant: ['published', { option: true }],
  isolatedBuilds: [
    async ({ browserName }, provide) => {
      const before = await protectedHashes();
      const owned: IsolatedBuild[] = [];
      try {
        const draft = await createIsolatedBuild('draft');
        owned.push(draft);
        const published = await createIsolatedBuild('published');
        owned.push(published);
        const simultaneous = await Promise.all([
          published.startPreview(),
          published.startPreview(),
        ]);
        expect(simultaneous[0]).toBe(simultaneous[1]);
        for (const build of owned) {
          const copiedSource = await fileHashes(path.join(build.root, 'src'));
          for (const [filename, hash] of Object.entries(before.source)) {
            if (filename === 'miniapps/registry.ts') continue;
            expect(
              copiedSource[filename],
              `Source changed in copy: ${filename}`,
            ).toBe(hash);
          }
          expect(
            Object.keys(copiedSource).filter(
              (filename) => !(filename in before.source),
            ),
          ).toEqual(['miniapps/plan-b/entry.astro']);
        }
        for (const filename of Object.keys(before.output)) {
          const text = (
            await readFile(path.join(projectRoot, 'dist', filename))
          ).toString();
          for (const marker of [
            'PB_I1_ISOLATED_FIXTURE',
            'Bad Day Plan',
            'plan-b',
          ]) {
            expect(filename).not.toContain(marker);
            expect(text).not.toContain(marker);
          }
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
