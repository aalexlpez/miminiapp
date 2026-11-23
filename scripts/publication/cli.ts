import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Local compiler only. This entry has no network client, deploy or Git writes.
if (process.argv.length > 3)
  throw new Error('Usage: build:production [manifest-path]');
const root = fileURLToPath(new URL('../../', import.meta.url));
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL('../../node_modules/astro/bin/astro.mjs', import.meta.url),
    ),
    'build',
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      MINIAPP_BUILD_TARGET: 'production',
      ...(process.argv[2] ? { MINIAPP_RELEASE_MANIFEST: process.argv[2] } : {}),
    },
    stdio: 'inherit',
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
