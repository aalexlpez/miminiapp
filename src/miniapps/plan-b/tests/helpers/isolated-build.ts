import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { preview, type PreviewServer } from 'astro';

const execute = promisify(execFile);
export const projectRoot = fileURLToPath(
  new URL('../../../../../', import.meta.url),
);
export type IsolatedVariant = 'draft' | 'published';

export async function fileHashes(
  directory: string,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  async function walk(current: string) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const filename = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else
        result[path.relative(directory, filename)] = createHash('sha256')
          .update(await readFile(filename))
          .digest('hex');
    }
  }
  await walk(directory);
  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b)),
  );
}

export async function protectedHashes() {
  return {
    source: await fileHashes(path.join(projectRoot, 'src')),
    output: await fileHashes(path.join(projectRoot, 'dist')),
  };
}

/** Only the temporary copy gets a registry replacement and a fixture entry. */
export async function createIsolatedBuild(variant: IsolatedVariant) {
  const root = await mkdtemp(path.join(tmpdir(), 'miminiapp-plan-b-'));
  let server: Promise<PreviewServer> | undefined;
  try {
    for (const filename of [
      'astro.config.mjs',
      'tsconfig.json',
      'package.json',
    ])
      await cp(path.join(projectRoot, filename), path.join(root, filename));
    for (const directory of ['src', 'public'])
      await cp(path.join(projectRoot, directory), path.join(root, directory), {
        recursive: true,
      });
    await symlink(
      path.join(projectRoot, 'node_modules'),
      path.join(root, 'node_modules'),
      'dir',
    );
    const entry = path.join(root, 'src/miniapps/plan-b/entry.astro');
    await mkdir(path.dirname(entry), { recursive: true });
    await cp(
      new URL('../fixtures/entry.astro.fixture', import.meta.url),
      entry,
    );
    await writeFile(
      path.join(root, 'src/miniapps/registry.ts'),
      `
import { validateRegistry, type MiniappRegistration } from '../lib/miniapp-registry';
import { metadata } from './plan-b/metadata';
export const miniappRegistry = validateRegistry([
  ${
    variant === 'draft'
      ? '{ descriptor: metadata }'
      : `{
    descriptor: { ...metadata, status: 'published', publishedAt: '2000-01-01' },
    loadEntry: () => import('./plan-b/entry.astro'),
  }`
  }
] satisfies readonly MiniappRegistration[]);
`,
    );
    await execute(
      process.execPath,
      [
        path.join(projectRoot, 'node_modules/astro/bin/astro.mjs'),
        'build',
        '--root',
        root,
      ],
      {
        cwd: root,
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
        timeout: 120_000,
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    return {
      root,
      variant,
      async startPreview(): Promise<string> {
        server ??= preview({
          root,
          logLevel: 'silent',
          server: { host: '127.0.0.1', port: 0 },
        });
        return `http://127.0.0.1:${(await server).port}`;
      },
      async close() {
        try {
          await (await server)?.stop();
        } finally {
          await rm(root, { recursive: true, force: true });
        }
      },
    };
  } catch (error) {
    await rm(root, { recursive: true, force: true });
    throw error;
  }
}

export type IsolatedBuild = Awaited<ReturnType<typeof createIsolatedBuild>>;
