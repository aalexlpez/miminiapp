import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cross-repository integration fixtures contain the exact controls under test,
// not a second implementation. Updating them is explicit and hash-verified.
const source = process.argv[2];
if (process.argv.length !== 3 || !source)
  throw new Error(
    'Usage: node scripts/publication/sync-selective-controls.ts <production-checkout>',
  );
const producer = resolve(source);
const destination = fileURLToPath(
  new URL('../../tests/fixtures/selective-controls/', import.meta.url),
);
const paths = [
  'scripts/promotion/core.ts',
  'scripts/promotion/miniapp-manifest.ts',
  'scripts/promotion/selective-contract.ts',
  'scripts/promotion/selective-engine.ts',
  'scripts/promotion/selective-build.ts',
  'tests/helpers/selective-github.ts',
  'tests/fixtures/source-release/workflows/staging.yml',
  '.github/promotion-policy.json',
  '.github/selective-promotion-policy.json',
  '.gitignore',
];
const files: Record<string, string> = {};
for (const path of paths) {
  const bytes = await readFile(join(producer, path));
  const output = join(destination, `${path}.fixture`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  files[path] = createHash('sha256').update(bytes).digest('hex');
}
const revision = execFileSync('git', ['-C', producer, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const dirty = Boolean(
  execFileSync('git', ['-C', producer, 'status', '--porcelain'], {
    encoding: 'utf8',
  }).trim(),
);
await writeFile(
  join(destination, 'manifest.json'),
  `${JSON.stringify({ schemaVersion: 1, repository: 'soycerobytes/miminiapp', revision, dirty, files }, null, 2)}\n`,
);
console.log(
  `Synchronized ${paths.length} exact control fixtures; source revision ${revision}${dirty ? ' with declared local changes' : ''}.`,
);
