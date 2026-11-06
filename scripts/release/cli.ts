import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertPhaseB,
  assertTarget,
  readPolicy,
  verifyCandidate,
  type StagingReceipt,
  type Target,
} from './gate.ts';
import {
  checkMerged,
  checkPromotion,
  checkRollback,
  saveProof,
  writeOutputs,
  type ProductionRelease,
  type TrustedCandidate,
} from './github.ts';
import {
  packageRelease,
  verifyRelease,
  type ReleaseManifest,
} from './manifest.ts';
import { runChild } from './process.ts';

function git(...args: string[]) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

export function assertCleanWorktree(directory = '.') {
  const changes = execFileSync(
    'git',
    ['-C', directory, 'status', '--porcelain', '--untracked-files=normal'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  if (changes.trim())
    throw new Error(
      'Release packaging requires a clean tracked and untracked working tree.',
    );
}

async function manifestOutputs(manifest: ReleaseManifest) {
  await writeOutputs({
    'source-sha': manifest.sourceSha,
    'source-tree': manifest.sourceTree,
    'payload-sha256': manifest.payloadSha256,
    'site-sha256': manifest.siteSha256,
    'candidate-run-id': manifest.buildRunId,
  });
}

async function readReceipt() {
  return JSON.parse(
    await readFile(
      process.env.RELEASE_RECEIPT_PATH ??
        '.local/staging-validation/staging-validation.json',
      'utf8',
    ),
  ) as StagingReceipt;
}

function matchTrusted(
  manifest: ReleaseManifest,
  candidate: TrustedCandidate,
  receipt: StagingReceipt,
) {
  verifyCandidate(manifest, receipt, candidate.proof);
  if (
    JSON.stringify(manifest) !== JSON.stringify(candidate.manifest) ||
    JSON.stringify(receipt) !== JSON.stringify(candidate.receipt)
  )
    throw new Error(
      'Downloaded release differs from the trusted staging archive.',
    );
}

/** Future publisher: the Phase A policy is checked before tokens, network, or Wrangler. */
export async function publish(target: Target, directory: string) {
  const policy = await readPolicy();
  assertPhaseB(policy, target, process.env.I03_PHASE_B_AUTHORIZED);
  const artifactDirectory = resolve(directory);
  const manifest = await verifyRelease(artifactDirectory);
  const rollback = process.env.RELEASE_OPERATION === 'rollback';
  if (process.env.RELEASE_OPERATION && !rollback)
    throw new Error('Unknown release operation.');
  let trusted: TrustedCandidate | undefined;
  if (rollback) trusted = await checkRollback(policy, target);
  else {
    const checked = await checkMerged(policy, target);
    trusted = checked.candidate;
    if (
      target === 'staging' &&
      (manifest.sourceSha !== checked.evidence.eventSha ||
        manifest.sourceTree !== checked.evidence.mergeTree ||
        manifest.buildRunId !== process.env.GITHUB_RUN_ID ||
        manifest.buildRunAttempt !== Number(process.env.GITHUB_RUN_ATTEMPT))
    )
      throw new Error(
        'Staging artifact was not built by this current protected-branch run.',
      );
  }
  if (trusted) matchTrusted(manifest, trusted, await readReceipt());
  const account = process.env.CLOUDFLARE_ACCOUNT_ID ?? '';
  const token = process.env.CLOUDFLARE_API_TOKEN ?? '';
  if (
    !/^[a-f0-9]{32}$/.test(account) ||
    !token ||
    process.env.RELEASE_TARGET !== target
  )
    throw new Error(
      'Explicit account, destination Environment and scoped token are required.',
    );
  const worker = policy.targets[target].worker;
  // Editor must address an already existing Worker. A failed read does not trigger bootstrap.
  const existing = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${worker}`,
    { headers: { Authorization: `Bearer ${token}` }, redirect: 'error' },
  );
  if (!existing.ok)
    throw new Error(
      `Existing destination Worker cannot be verified (${existing.status}); no deployment attempted.`,
    );
  await existing.body?.cancel();
  const wrangler = JSON.parse(
    await readFile('node_modules/wrangler/package.json', 'utf8'),
  ) as { version: string };
  if (wrangler.version !== '4.158.0')
    throw new Error('Wrangler version differs from approved 4.158.0.');
  // Repeat under the workflow's shared publication lock immediately before the write.
  if (rollback) {
    const current = await checkRollback(policy, target);
    matchTrusted(manifest, current, await readReceipt());
  } else {
    const current = await checkMerged(policy, target);
    if (trusted && current.candidate)
      matchTrusted(manifest, current.candidate, await readReceipt());
    else if (
      current.evidence.eventSha !== manifest.sourceSha ||
      current.evidence.mergeTree !== manifest.sourceTree
    )
      throw new Error('Candidate changed before deployment.');
  }
  const frozen = await verifyRelease(artifactDirectory);
  if (frozen.siteSha256 !== manifest.siteSha256)
    throw new Error('Release changed immediately before deployment.');
  await runChild(
    process.execPath,
    [
      'node_modules/wrangler/bin/wrangler.js',
      'deploy',
      '--config',
      `deploy/cloudflare/${target}.jsonc`,
      '--name',
      worker,
      '--assets',
      resolve(artifactDirectory, 'site'),
    ],
    {
      stdio: 'inherit',
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
    },
  );
  if (
    (await verifyRelease(artifactDirectory)).siteSha256 !== manifest.siteSha256
  )
    throw new Error(
      'Release was modified during deployment; investigate actual published state.',
    );
  if (target === 'production' && trusted && !rollback) {
    const record: ProductionRelease = {
      schemaVersion: 1,
      target,
      productionRunId: process.env.GITHUB_RUN_ID ?? '',
      productionRunAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
      sourceRunId: trusted.proof.runId,
      sourceRunAttempt: trusted.proof.runAttempt,
      sourceSha: manifest.sourceSha,
      sourceTree: manifest.sourceTree,
      artifactId: trusted.proof.artifactId,
      receiptArtifactId: trusted.proof.receiptArtifactId,
      siteSha256: manifest.siteSha256,
    };
    await mkdir('.local', { recursive: true });
    await writeFile(
      '.local/production-release.json',
      `${JSON.stringify(record, null, 2)}\n`,
    );
  }
  await manifestOutputs(manifest);
}

export async function main(args: string[]) {
  const [operation, first, second] = args;
  if (operation === 'pack') {
    if (!first || !second || args.length !== 3)
      throw new Error('Usage: pack dist artifactDirectory');
    assertCleanWorktree();
    const policy = await readPolicy();
    const sha = process.env.GITHUB_SHA ?? git('rev-parse', 'HEAD');
    if (git('rev-parse', 'HEAD') !== sha)
      throw new Error('Checkout does not match the build source SHA.');
    const manifest = await packageRelease(first, second, {
      repository: policy.repository,
      repositoryId: policy.repositoryId,
      sourceSha: sha,
      sourceTree: git('rev-parse', `${sha}^{tree}`),
      buildRunId: process.env.GITHUB_RUN_ID ?? '0',
      buildRunAttempt: Number(process.env.GITHUB_RUN_ATTEMPT ?? '1'),
    });
    await manifestOutputs(manifest);
  } else if (operation === 'verify') {
    if (!first || args.length !== 2)
      throw new Error('Usage: verify artifactDirectory');
    await manifestOutputs(await verifyRelease(first));
  } else if (operation === 'assert-phase-b') {
    assertPhaseB(await readPolicy(), first, process.env.I03_PHASE_B_AUTHORIZED);
  } else if (operation === 'check-promotion') {
    await saveProof(await checkPromotion(await readPolicy()));
  } else if (operation === 'check-merged') {
    assertTarget(first);
    const checked = await checkMerged(await readPolicy(), first);
    if (checked.candidate) await saveProof(checked.candidate);
    else
      await writeOutputs({
        'source-sha': checked.evidence.eventSha,
        'source-tree': checked.evidence.mergeTree,
      });
  } else if (operation === 'check-rollback') {
    assertTarget(first);
    await saveProof(await checkRollback(await readPolicy(), first));
  } else if (operation === 'verify-receipt') {
    if (!first || !second)
      throw new Error('Usage: verify-receipt artifactDirectory receiptFile');
    const manifest = await verifyRelease(first);
    const receipt = JSON.parse(
      await readFile(second, 'utf8'),
    ) as StagingReceipt;
    // The proof was generated by a read-only online gate, outside the downloaded artifact.
    const proof = JSON.parse(
      await readFile('.local/promotion-proof.json', 'utf8'),
    );
    verifyCandidate(manifest, receipt, proof);
    await manifestOutputs(manifest);
  } else if (operation === 'receipt') {
    if (!first || !second || process.env.REMOTE_TESTS_PASSED !== 'true')
      throw new Error('Receipt requires completed successful remote tests.');
    const manifest = await verifyRelease(first);
    if (
      manifest.buildRunId !== process.env.GITHUB_RUN_ID ||
      manifest.buildRunAttempt !== Number(process.env.GITHUB_RUN_ATTEMPT) ||
      manifest.sourceSha !== process.env.GITHUB_SHA ||
      process.env.GITHUB_REF !== 'refs/heads/staging' ||
      process.env.GITHUB_EVENT_NAME !== 'push' ||
      !/^\d+$/.test(process.env.MANIFEST_ARTIFACT_ID ?? '') ||
      !/^sha256:[a-f0-9]{64}$/.test(process.env.MANIFEST_ARTIFACT_DIGEST ?? '')
    )
      throw new Error(
        'Receipt does not match the current staging run and uploaded archive.',
      );
    const receipt: StagingReceipt = {
      schemaVersion: 1,
      repository: manifest.repository,
      repositoryId: manifest.repositoryId,
      sourceSha: manifest.sourceSha,
      sourceTree: manifest.sourceTree,
      payloadSha256: manifest.payloadSha256,
      siteSha256: manifest.siteSha256,
      runId: manifest.buildRunId,
      runAttempt: manifest.buildRunAttempt,
      artifactId: process.env.MANIFEST_ARTIFACT_ID!,
      artifactDigest: process.env.MANIFEST_ARTIFACT_DIGEST!,
      remoteTestsPassed: true,
    };
    await mkdir(dirname(second), { recursive: true });
    await writeFile(second, `${JSON.stringify(receipt, null, 2)}\n`);
  } else if (operation === 'publish') {
    assertTarget(first);
    if (!second) throw new Error('An immutable release artifact is required.');
    await publish(first, second);
  } else throw new Error('Unknown release command.');
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : 'Release command failed.',
    );
    process.exitCode = 1;
  });
}
