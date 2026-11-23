import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  readFile,
  writeFile,
  mkdir,
  mkdtemp,
  symlink,
  readdir,
  lstat,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { preview } from 'astro';
import { registrations } from '../../scripts/publication/registry-source.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const evidence = join(root, '.local/verification/ps02');
await mkdir(evidence, { recursive: true });
const run = await mkdtemp(join(evidence, 'integration-'));
const fixtureRoot = join(root, 'tests/fixtures/selective-controls');
const manifest = JSON.parse(
  await readFile(join(fixtureRoot, 'manifest.json'), 'utf8'),
) as { revision: string; dirty: boolean; files: Record<string, string> };
const controls = join(run, 'control');
for (const [path, expected] of Object.entries(manifest.files)) {
  assert(!path.startsWith('/') && !path.split('/').includes('..'));
  const bytes = await readFile(join(fixtureRoot, `${path}.fixture`));
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    expected,
    `Control fixture changed without updating its manifest: ${path}`,
  );
  await mkdir(dirname(join(controls, path)), { recursive: true });
  await writeFile(join(controls, path), bytes);
}
const engine = await import(
  pathToFileURL(join(controls, 'scripts/promotion/selective-engine.ts')).href
);
const build = await import(
  pathToFileURL(join(controls, 'scripts/promotion/selective-build.ts')).href
);
const fixture = await import(
  pathToFileURL(join(controls, 'tests/helpers/selective-github.ts')).href
);
const state = fixture.selectiveFixture();
const sourceFiles: Record<string, { bytes: Buffer; mode: string }> =
  Object.create(null);
const names = execFileSync(
  'git',
  ['-C', root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
)
  .split('\0')
  .filter(Boolean);
for (const name of [...new Set(names)].sort()) {
  const stat = await lstat(join(root, name));
  assert(stat.isFile() && !stat.isSymbolicLink());
  const bytes = await readFile(join(root, name));
  sourceFiles[name] = { bytes, mode: stat.mode & 0o111 ? '100755' : '100644' };
}
for (const slug of ['ps02-a', 'ps02-b']) {
  sourceFiles[`src/miniapps/${slug}/metadata.ts`] = fixture.file(
    `export const metadata = { id: '${slug}', slug: '${slug}', status: 'published', publishedAt: '2000-01-01', category: 'science', icon: '/brand/${slug}/icon.svg', copy: { es: { title: '${slug}', description: 'Prueba de integración' }, en: { title: '${slug}', description: 'Integration fixture' } } } as const;`,
  );
  sourceFiles[`src/miniapps/${slug}/entry.astro`] = fixture.file(
    `<p data-test="PS02_UI_${slug}">Synthetic application ${slug}</p><script>document.documentElement.dataset.fixture = '${slug}';</script>`,
  );
  sourceFiles[`public/brand/${slug}/icon.svg`] = fixture.file(
    `<svg xmlns="http://www.w3.org/2000/svg"><title>${slug}</title></svg>`,
  );
}
let registry = sourceFiles['src/miniapps/registry.ts'].bytes.toString('utf8');
registry = registry.replace(
  'export const miniappRegistry',
  "import { metadata as a } from './ps02-a/metadata';\nimport { metadata as b } from './ps02-b/metadata';\nexport const miniappRegistry",
);
registry = registry.replace(
  'validateRegistry([',
  "validateRegistry([\n  { descriptor: a, loadEntry: () => import('./ps02-a/entry.astro') },\n  { descriptor: b, loadEntry: () => import('./ps02-b/entry.astro') },",
);
sourceFiles['src/miniapps/registry.ts'] = fixture.file(registry);
const assets = JSON.parse(
  sourceFiles['scripts/publication/public-assets.json'].bytes.toString('utf8'),
);
for (const slug of ['ps02-a', 'ps02-b'])
  assets.miniapps[slug] = [`brand/${slug}/**`];
sourceFiles['scripts/publication/public-assets.json'] = fixture.file(
  JSON.stringify(assets),
);
state.source.files = sourceFiles;
state.source.registrations = registrations(registry);
const api = new fixture.MemorySelectiveGitHub(state.source, state.base);
const fetchBefore = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = new URL(
    typeof input === 'string' || input instanceof URL
      ? input.toString()
      : input.url,
  );
  assert.equal(
    url.hostname,
    '127.0.0.1',
    'Integration tests must not send network requests outside the local test server.',
  );
  return fetchBefore(input, init);
};
const results: unknown[] = [];
try {
  for (const [index, additions] of [[], ['ps02-a'], ['ps02-b']].entries()) {
    const request = {
      ...state.request,
      expectedBaseSha: api.base.sha,
      releaseId: `ps02-${index}`,
      plannedReleaseDate: index === 2 ? '2027-01-08' : '2027-01-01',
      addMiniapps: additions,
      initializeEmpty: index === 0,
    };
    const candidate = engine.createSelectiveCandidate(
      state.policy,
      request,
      api.source,
      api.base,
    );
    const directory = join(run, `candidate-${index}`);
    await build.writeCandidate(directory, candidate);
    await symlink(
      join(root, 'node_modules'),
      join(directory, 'node_modules'),
      'dir',
    );
    build.runSelectiveCompiler(directory, false);
    const verified = await build.verifySelectiveBuild(directory, candidate);
    const result = await engine.prepareSelectiveRelease(
      state.policy,
      candidate,
      verified.receipt,
      verified.sha256,
      api,
    );
    assert.equal(result.outcome, 'prepared');
    const pr = api.pulls.find(
      (p: { headSha: string }) => p.headSha === result.headSha,
    );
    const commit = api.commits.get(result.headSha);
    assert(commit && pr);
    assert.equal(
      engine.checkSelectivePR(
        state.policy,
        candidate,
        {
          state: 'open',
          number: pr.number,
          baseSha: pr.baseSha,
          headSha: pr.headSha,
          headRef: pr.headRef,
          repositoryId: '1455524397',
          parents: commit.parents.map((p: { sha: string }) => p.sha),
          mergeParents: [pr.baseSha, pr.headSha],
          files: commit.files,
        },
        verified.receipt,
        verified.sha256,
      ).verified,
      true,
    );
    assert.equal(
      (
        await engine.prepareSelectiveRelease(
          state.policy,
          candidate,
          verified.receipt,
          verified.sha256,
          api,
        )
      ).outcome,
      'existing',
    );
    assert.equal(api.pulls.length, 1);
    const server = await preview({
      root: directory,
      logLevel: 'silent',
      server: { host: '127.0.0.1', port: 0 },
    });
    try {
      for (const path of [
        '/es/apps/plan-b/',
        '/en/apps/plan-b/',
        '/brand/plan-b/icon.png',
      ])
        assert.equal(
          (await fetch(`http://127.0.0.1:${server.port}${path}`)).status,
          404,
        );
      for (const entry of candidate.manifest.miniapps)
        for (const locale of ['es', 'en']) {
          const response = await fetch(
            `http://127.0.0.1:${server.port}/${locale}/apps/${entry.slug}/`,
          );
          assert.equal(response.status, 200);
          assert((await response.text()).includes(`PS02_UI_${entry.slug}`));
        }
    } finally {
      await server.stop();
    }
    results.push({
      candidateId: candidate.candidateId,
      manifest: candidate.manifest,
      changedPaths: candidate.changes.map((c: { path: string }) => c.path),
      receiptSha256: verified.sha256,
      distFiles: Object.keys(verified.receipt.files).length,
      interceptedWrites: api.calls.filter(
        (c: { method: string }) => c.method === 'POST',
      ).length,
    });
    await writeFile(
      join(evidence, `receipt-${index}.json`),
      JSON.stringify(verified.receipt, null, 2),
    );
    api.accept(result.headSha);
  }
  assert.deepEqual(
    api.base.files['.github/workflows/ci.yml'].bytes,
    state.base.files['.github/workflows/ci.yml'].bytes,
  );
  assert(
    !api.calls.some((c: { path: string }) =>
      /\/merges|deploy|wrangler/.test(c.path),
    ),
  );
  assert.equal(
    api.base.files['.github/miniapp-release.json'] !== undefined,
    true,
  );
  const selected = JSON.parse(
    api.base.files['.github/miniapp-release.json'].bytes.toString('utf8'),
  ).miniapps;
  assert.deepEqual(
    selected.map((e: { slug: string; plannedReleaseDate: string }) => [
      e.slug,
      e.plannedReleaseDate,
    ]),
    [
      ['ps02-a', '2027-01-01'],
      ['ps02-b', '2027-01-08'],
    ],
  );
  // Build evidence and inventories must remain outside every public output.
  for (const name of await readdir(join(run, 'candidate-2/dist')))
    assert(!/receipt|selective-policy/.test(name));
  await writeFile(
    join(evidence, 'integration.json'),
    JSON.stringify(
      {
        testOnly: true,
        fixtureRevision: manifest.revision,
        fixtureDirty: manifest.dirty,
        planBPublished: false,
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    'PS-02 integration verified: real selective compiler, preparer and PR checker; empty/A/A+B; only in-memory GitHub writes; Plan B excluded.',
  );
} finally {
  globalThis.fetch = fetchBefore;
}
