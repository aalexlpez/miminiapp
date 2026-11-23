import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { chromium } from '@playwright/test';
import {
  readRelease,
  releaseText,
  type MiniappRelease,
} from '../../scripts/publication/manifest.ts';
import { publicFiles } from '../../scripts/publication/assets.ts';

const project = fileURLToPath(new URL('../../', import.meta.url));
const evidence = join(project, '.local/verification/ps01');
await mkdir(evidence, { recursive: true });
const root = await mkdtemp(join(evidence, 'selective-'));
for (const name of [
  'astro.config.mjs',
  'tsconfig.json',
  'package.json',
  'src',
  'public',
  'scripts/publication',
]) {
  await mkdir(resolve(root, name, '..'), { recursive: true });
  await cp(join(project, name), join(root, name), { recursive: true });
}
await symlink(join(project, 'node_modules'), join(root, 'node_modules'), 'dir');

// Actual Plan B code and its public icon remain present in the input snapshot.
const originalRegistry = await readFile(
  join(root, 'src/miniapps/registry.ts'),
  'utf8',
);
for (const slug of ['ps01-a', 'ps01-b', 'ps01-draft']) {
  const directory = join(root, 'src/miniapps', slug);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, 'metadata.ts'),
    `export const metadata = { id: '${slug}', slug: '${slug}', status: '${slug.endsWith('draft') ? 'draft' : 'published'}', category: 'science', publishedAt: '2000-01-01', icon: '/brand/${slug}/icon.svg', copy: { es: { title: '${slug}', description: 'Prueba sintética' }, en: { title: '${slug}', description: 'Synthetic test' } } } as const;`,
  );
  await writeFile(
    join(directory, 'entry.astro'),
    `---\nimport Island from './Island';\n---\n<Island client:load />`,
  );
  await writeFile(
    join(directory, 'Island.tsx'),
    `export default function Island() { return <button onClick={() => { document.documentElement.dataset.result = '${slug}'; }}>PS01_UI_${slug}</button>; }`,
  );
  const assets = join(root, 'public/brand', slug);
  await mkdir(assets, { recursive: true });
  await writeFile(
    join(assets, 'icon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg"><title>PS01_ASSET_${slug}</title></svg>`,
  );
}
const syntheticRegistry = originalRegistry
  .replace(
    /import \{ metadata as planB \}/,
    `import { metadata as a } from './ps01-a/metadata';\nimport { metadata as b } from './ps01-b/metadata';\nimport { metadata as draft } from './ps01-draft/metadata';\nimport { metadata as planB }`,
  )
  .replace(
    /\[\n  \{ descriptor: planB/,
    `[\n  { descriptor: a, loadEntry: () => import('./ps01-a/entry.astro') },\n  { descriptor: b, loadEntry: () => import('./ps01-b/entry.astro') },\n  { descriptor: draft },\n  { descriptor: planB`,
  );
await writeFile(join(root, 'src/miniapps/registry.ts'), syntheticRegistry);
const ownershipPath = join(root, 'scripts/publication/public-assets.json');
const ownership = JSON.parse(await readFile(ownershipPath, 'utf8'));
for (const slug of ['ps01-a', 'ps01-b', 'ps01-draft'])
  ownership.miniapps[slug] = [`brand/${slug}/**`];
await writeFile(ownershipPath, JSON.stringify(ownership));
const manifestPath = join(root, 'test-release.json');
const release: MiniappRelease = {
  schemaVersion: 1,
  releaseId: 'ps01-local-test',
  sourceSha: 'a'.repeat(40),
  destinationBaseSha: 'b'.repeat(40),
  miniapps: [],
};
const results: unknown[] = [];

async function build(
  name: string,
  selection: string[],
  expectedError?: string,
) {
  await writeFile(
    manifestPath,
    releaseText({
      ...release,
      miniapps: selection.map((slug) => ({
        slug,
        plannedReleaseDate: '2027-01-01',
      })),
    }),
  );
  const run = spawnSync(
    process.execPath,
    [
      join(project, 'node_modules/astro/bin/astro.mjs'),
      'build',
      '--root',
      root,
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: '1',
        MINIAPP_BUILD_TARGET: 'production',
        MINIAPP_RELEASE_MANIFEST: manifestPath,
      },
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  await writeFile(join(evidence, `${name}.log`), `${run.stdout}${run.stderr}`);
  if (expectedError) {
    assert.notEqual(run.status, 0, `${name} unexpectedly compiled`);
    assert(
      `${run.stdout}${run.stderr}`.includes(expectedError),
      `${name} failed for an unexpected reason`,
    );
    return;
  }
  assert.equal(run.status, 0, `${name}: see ${join(evidence, `${name}.log`)}`);
  const files = await publicFiles(join(root, 'dist'));
  const pages = files.filter(
    (name) => name.includes('/apps/') && name.endsWith('.html'),
  );
  assert.deepEqual(
    pages,
    selection
      .flatMap((slug) =>
        ['es', 'en'].map((locale) => `${locale}/apps/${slug}/index.html`),
      )
      .sort(),
  );
  const excluded = ['plan-b', 'ps01-a', 'ps01-b', 'ps01-draft'].filter(
    (slug) => !selection.includes(slug),
  );
  for (const slug of excluded) {
    assert(
      !files.some((name) => name.includes(`brand/${slug}/`)),
      `${slug} public assets leaked`,
    );
    for (const name of files.filter((name) =>
      /\.(?:html|js|css|json|svg)$/.test(name),
    )) {
      const text = await readFile(join(root, 'dist', name), 'utf8');
      assert(
        !text.includes(`/apps/${slug}/`) &&
          !text.includes(`PS01_UI_${slug}`) &&
          !text.includes(`PS01_ASSET_${slug}`),
        `${slug} leaked into ${name}`,
      );
    }
  }
  for (const slug of selection)
    assert(files.includes(`brand/${slug}/icon.svg`));
  const reports = (await readdir(join(root, '.local/publication'))).filter(
    (name) => name.endsWith('-modules.json'),
  );
  // Find the report for this exact selection, independently of random temp names.
  const audits = await Promise.all(
    reports.map(async (name) =>
      JSON.parse(
        await readFile(join(root, '.local/publication', name), 'utf8'),
      ),
    ),
  );
  const audit = audits.find(
    (item) =>
      releaseText(item.release) ===
      releaseText(readRelease(manifestText(selection))),
  );
  assert(audit, 'Missing module graph evidence for the exact selection');
  for (const slug of excluded)
    assert(
      !audit.modules.some((id: string) =>
        id.includes(`/src/miniapps/${slug}/`),
      ),
    );
  const server = await preview({
    root,
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0 },
  });
  try {
    for (const locale of ['es', 'en']) {
      const base = `http://127.0.0.1:${server.port}`;
      const html = await (await fetch(`${base}/${locale}/`)).text();
      for (const slug of selection)
        assert(html.includes(`/${locale}/apps/${slug}/`));
      if (selection.length) {
        const browser = await chromium.launch({ headless: true });
        try {
          const page = await browser.newPage();
          const errors: string[] = [];
          page.on('pageerror', (error) => errors.push(error.message));
          for (const slug of selection) {
            await page.goto(`${base}/${locale}/apps/${slug}/`);
            await page.getByRole('button', { name: `PS01_UI_${slug}` }).click();
            assert.equal(
              await page.locator('html').getAttribute('data-result'),
              slug,
            );
          }
          assert.deepEqual(errors, []);
        } finally {
          await browser.close();
        }
      }
      for (const slug of excluded) {
        assert(!html.includes(`/${locale}/apps/${slug}/`));
        assert.equal(
          (await fetch(`${base}/${locale}/apps/${slug}/`)).status,
          404,
        );
        assert.equal(
          (
            await fetch(
              `${base}/brand/${slug}/icon.${slug === 'plan-b' ? 'png' : 'svg'}`,
            )
          ).status,
          404,
        );
      }
    }
  } finally {
    await server.stop();
  }
  const hashes = Object.fromEntries(
    await Promise.all(
      files.map(async (name) => [
        name,
        createHash('sha256')
          .update(await readFile(join(root, 'dist', name)))
          .digest('hex'),
      ]),
    ),
  );
  results.push({
    name,
    selection,
    pages,
    excluded,
    files: files.length,
    hashes,
  });
}
function manifestText(selection: string[]) {
  return releaseText({
    ...release,
    miniapps: selection.map((slug) => ({
      slug,
      plannedReleaseDate: '2027-01-01',
    })),
  });
}

await build('production-empty', []);
await build('production-a', ['ps01-a']);
await build('production-ab', ['ps01-a', 'ps01-b']);
await build('production-unknown', ['unknown'], 'Unknown or draft');
await build('production-draft', ['ps01-draft'], 'Unknown or draft');
await writeFile(join(root, 'public/unowned.txt'), 'must fail closed');
await build('production-unowned', [], 'exactly one owner');
await writeFile(
  join(evidence, 'selective-build.json'),
  JSON.stringify(
    { testOnly: true, root, planBPublished: false, results },
    null,
    2,
  ),
);
console.log(
  `Selective builds verified locally; ${results.length} valid variants, unknown/draft/unowned cases rejected. Plan B excluded from every production variant.`,
);
