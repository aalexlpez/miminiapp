import { readFile, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { copySelectedAssets, publicFiles, selectedAssets } from './assets.ts';
import { readRelease } from './manifest.ts';
import { productionRegistry, registrations } from './registry-source.ts';

/** Production is explicit; NODE_ENV is intentionally irrelevant. */
export async function publicationBuild(root: string, env = process.env) {
  const target = env.MINIAPP_BUILD_TARGET ?? 'staging';
  if (target !== 'staging' && target !== 'production')
    throw new Error('Unknown miniapp build target.');
  if (target === 'staging') return { plugins: [] };
  const release = readRelease(
    await readFile(
      resolve(
        root,
        env.MINIAPP_RELEASE_MANIFEST ?? '.github/miniapp-release.json',
      ),
      'utf8',
    ),
  );
  const registryPath = join(root, 'src/miniapps/registry.ts');
  const source = await readFile(registryPath, 'utf8');
  const registry = productionRegistry(source, release);
  const ownership: unknown = JSON.parse(
    await readFile(
      join(root, 'scripts/publication/public-assets.json'),
      'utf8',
    ),
  );
  const registered = registrations(source).map(({ slug }) => slug);
  const publicRoot = join(root, 'public');
  const files = selectedAssets(
    await publicFiles(publicRoot),
    ownership as Parameters<typeof selectedAssets>[1],
    registered,
    release.miniapps.map(({ slug }) => slug),
  );
  const temporaryRoot = join(root, '.local/publication');
  await mkdir(temporaryRoot, { recursive: true });
  const publicDir = await mkdtemp(join(temporaryRoot, 'public-'));
  await copySelectedAssets(publicRoot, publicDir, files);
  const bundledModules = new Set<string>();
  return {
    publicDir,
    plugins: [
      {
        name: 'miminiapp-production-registry',
        enforce: 'pre' as const,
        load(id: string) {
          if (id.split('?')[0] === registryPath) return registry;
        },
        async generateBundle(
          _options: unknown,
          bundle: Record<
            string,
            { type: string; modules?: Record<string, unknown> }
          >,
        ) {
          for (const entry of Object.values(bundle))
            for (const id of Object.keys(entry.modules ?? {}))
              bundledModules.add(id);
          const modules = [...bundledModules].sort();
          const selected = new Set(release.miniapps.map(({ slug }) => slug));
          for (const id of modules) {
            const match = /\/src\/miniapps\/([^/]+)\//.exec(id);
            if (match && !selected.has(match[1]))
              throw new Error(
                `Excluded miniapp reached the production bundle: ${match[1]}`,
              );
          }
          // Build evidence stays outside publicDir and dist, never on the website.
          await writeFile(
            `${publicDir}-modules.json`,
            JSON.stringify({ release, modules, publicFiles: files }, null, 2),
          );
        },
      },
    ],
  };
}
