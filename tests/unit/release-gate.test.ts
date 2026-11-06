import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  assertPhaseB,
  verifyCandidate,
  verifyMerge,
  type CandidateProof,
  type DeploymentPolicy,
  type MergeEvidence,
  type StagingReceipt,
} from '../../scripts/release/gate.ts';
import { publish } from '../../scripts/release/cli.ts';
import { type ReleaseManifest } from '../../scripts/release/manifest.ts';

const sha = 'a'.repeat(40);
const tree = 'b'.repeat(40);
const base = 'c'.repeat(40);
const digest = 'd'.repeat(64);
const policy: DeploymentPolicy = {
  schemaVersion: 1,
  phase: 'A',
  deploymentsEnabled: false,
  repository: 'aalexlpez/miminiapp',
  repositoryId: '1445849027',
  owner: 'aalexlpez',
  targets: {
    staging: {
      branch: 'staging',
      worker: 'miminiapp-staging',
      url: 'https://miminiapp-staging.miminiapp-lab.workers.dev',
    },
    production: {
      branch: 'main',
      worker: 'miminiapp',
      url: 'https://miminiapp.miminiapp-lab.workers.dev',
    },
  },
};
const manifest: ReleaseManifest = {
  schemaVersion: 1,
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  buildRunId: '123',
  buildRunAttempt: 2,
  payloadSha256: digest,
  siteSha256: digest,
  files: { 'release-manifest.json': digest },
};
const proof: CandidateProof = {
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  currentStagingSha: sha,
  mainSha: base,
  mainTree: tree,
  runId: '123',
  runAttempt: 2,
  artifactId: '456',
  artifactDigest: `sha256:${digest}`,
  receiptArtifactId: '789',
  receiptArtifactDigest: `sha256:${digest}`,
};
const receipt: StagingReceipt = {
  schemaVersion: 1,
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  payloadSha256: digest,
  siteSha256: digest,
  runId: '123',
  runAttempt: 2,
  artifactId: '456',
  artifactDigest: `sha256:${digest}`,
  remoteTestsPassed: true,
};
const merge: MergeEvidence = {
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  actor: policy.owner,
  triggeringActor: policy.owner,
  eventName: 'push',
  eventRef: 'refs/heads/main',
  eventSha: sha,
  currentRefSha: sha,
  mergeCommitSha: sha,
  mergeTree: tree,
  expectedBaseSha: base,
  actualBaseSha: base,
  pr: {
    merged: true,
    base: 'main',
    head: 'staging',
    headRepositoryId: policy.repositoryId,
    mergedBy: policy.owner,
    headSha: sha,
  },
  checks: { quality: 'success', promotion: 'success' },
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('Phase A publication stop', () => {
  it('requires both a committed Phase B policy and the separate activation flag', () => {
    expect(() => assertPhaseB(policy, 'production', 'true')).toThrow(
      'not authorized',
    );
    const enabled: DeploymentPolicy = {
      ...policy,
      phase: 'B',
      deploymentsEnabled: true,
    };
    expect(() => assertPhaseB(enabled, 'production', undefined)).toThrow(
      'not authorized',
    );
    expect(() => assertPhaseB(enabled, 'production', 'false')).toThrow(
      'not authorized',
    );
    expect(() => assertPhaseB(enabled, 'production', 'true')).not.toThrow();
    expect(() =>
      assertPhaseB(
        {
          ...enabled,
          targets: { ...enabled.targets, staging: enabled.targets.production },
        },
        'staging',
        'true',
      ),
    ).toThrow('destination mismatch');
  });

  it('direct publisher invocation is rejected before network, token use, artifact read, or Wrangler', async () => {
    const network = vi.fn(() => {
      throw new Error('Network must remain unused.');
    });
    vi.stubGlobal('fetch', network);
    vi.stubEnv('I03_PHASE_B_AUTHORIZED', 'true');
    await expect(publish('production', '/does/not/exist')).rejects.toThrow(
      'Phase B is not authorized',
    );
    expect(network).not.toHaveBeenCalled();
  });
});

describe('staging candidate equivalence', () => {
  it('accepts only the byte identity and provenance of the trusted successful attempt', () => {
    expect(() => verifyCandidate(manifest, receipt, proof)).not.toThrow();
  });
  it.each([
    ['currentStagingSha', base],
    ['mainTree', sha],
    ['runId', '999'],
    ['runAttempt', 3],
    ['sourceTree', sha],
    ['artifactDigest', 'forged'],
    ['repositoryId', '888'],
  ])('rejects stale or forged trusted metadata %s', (key, value) => {
    expect(() =>
      verifyCandidate(manifest, receipt, { ...proof, [key]: value }),
    ).toThrow();
  });
  it.each([
    ['artifactId', '999'],
    ['artifactDigest', `sha256:${'e'.repeat(64)}`],
    ['runAttempt', 1],
    ['siteSha256', 'e'.repeat(64)],
    ['payloadSha256', 'e'.repeat(64)],
    ['remoteTestsPassed', false],
    ['sourceTree', sha],
  ])('rejects substituted validation receipt %s', (key, value) => {
    expect(() =>
      verifyCandidate(
        manifest,
        { ...receipt, [key]: value } as StagingReceipt,
        proof,
      ),
    ).toThrow();
  });
  it('rejects a rebuild with the same source and different bytes', () => {
    expect(() =>
      verifyCandidate(
        { ...manifest, payloadSha256: 'e'.repeat(64) },
        receipt,
        proof,
      ),
    ).toThrow();
  });
});

describe('owner merge and race boundaries', () => {
  it('accepts the current manually merged staging promotion with both native checks', () => {
    expect(() => verifyMerge(merge, policy, 'production')).not.toThrow();
  });
  it.each([
    ['triggeringActor', 'other'],
    ['actor', 'other'],
    ['eventName', 'workflow_dispatch'],
    ['eventRef', 'refs/tags/release'],
    ['currentRefSha', base],
    ['actualBaseSha', sha],
    ['repositoryId', '888'],
  ])('rejects invalid event context %s', (key, value) => {
    expect(() =>
      verifyMerge({ ...merge, [key]: value }, policy, 'production'),
    ).toThrow();
  });
  it.each([
    ['head', 'feature/new'],
    ['headRepositoryId', '999'],
    ['mergedBy', 'other'],
    ['merged', false],
  ])('rejects an unauthorized PR field %s', (key, value) => {
    expect(() =>
      verifyMerge(
        { ...merge, pr: { ...merge.pr, [key]: value } },
        policy,
        'production',
      ),
    ).toThrow();
  });
  it.each(['quality', 'promotion'])(
    'does not treat missing, skipped or failed %s as a passing gate',
    (key) => {
      for (const value of ['failure', 'skipped', undefined])
        expect(() =>
          verifyMerge(
            { ...merge, checks: { ...merge.checks, [key]: value } },
            policy,
            'production',
          ),
        ).toThrow();
    },
  );
});
