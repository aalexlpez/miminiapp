import { cp, lstat, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, matchesGlob } from 'node:path';
import { slugPattern } from './manifest.ts';

export interface AssetOwnership {
  schemaVersion: 1;
  shared: string[];
  miniapps: Record<string, string[]>;
}

export function validateOwnership(
  value: unknown,
  registered: readonly string[],
): asserts value is AssetOwnership {
  const v = value as AssetOwnership;
  const pattern = (p: unknown): p is string =>
    typeof p === 'string' &&
    /^[a-zA-Z0-9_.*?/-]+$/.test(p) &&
    !p.startsWith('/') &&
    !p.split('/').some((part) => !part || part === '.' || part === '..');
  const patterns = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every(pattern) && new Set(v).size === v.length;
  if (
    !v ||
    typeof v !== 'object' ||
    Object.keys(v).sort().join(',') !== 'miniapps,schemaVersion,shared' ||
    v.schemaVersion !== 1 ||
    !patterns(v.shared) ||
    !v.miniapps ||
    typeof v.miniapps !== 'object' ||
    Array.isArray(v.miniapps) ||
    !Object.entries(v.miniapps).every(
      ([slug, paths]) =>
        slugPattern.test(slug) && registered.includes(slug) && patterns(paths),
    )
  )
    throw new Error('Invalid public asset ownership.');
}

export async function publicFiles(root: string): Promise<string[]> {
  if ((await lstat(root)).isSymbolicLink())
    throw new Error('Asset directory symlinks are forbidden.');
  const result: string[] = [];
  async function visit(relative: string) {
    for (const entry of await readdir(join(root, relative), {
      withFileTypes: true,
    })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const details = await lstat(join(root, name));
      if (details.isSymbolicLink())
        throw new Error(`Public asset symlinks are forbidden: ${name}`);
      if (details.isDirectory()) await visit(name);
      else if (details.isFile()) result.push(name);
      else throw new Error(`Unsupported public asset: ${name}`);
    }
  }
  await visit('');
  return result.sort();
}

/** Unknown paths and multiple owners fail even when all apps are excluded. */
export function selectedAssets(
  files: readonly string[],
  ownership: AssetOwnership,
  registered: readonly string[],
  selected: readonly string[],
) {
  validateOwnership(ownership, registered);
  return files.filter((file) => {
    const shared = ownership.shared.some((p) => matchesGlob(file, p));
    const owners = Object.entries(ownership.miniapps)
      .filter(([, patterns]) => patterns.some((p) => matchesGlob(file, p)))
      .map(([slug]) => slug);
    if (owners.length + Number(shared) !== 1)
      throw new Error(`Public asset requires exactly one owner: ${file}`);
    return shared || selected.includes(owners[0]);
  });
}

export async function copySelectedAssets(
  root: string,
  destination: string,
  files: readonly string[],
) {
  for (const file of files) {
    await mkdir(dirname(join(destination, file)), { recursive: true });
    await cp(join(root, file), join(destination, file), {
      dereference: false,
      errorOnExist: true,
      force: false,
    });
  }
}
