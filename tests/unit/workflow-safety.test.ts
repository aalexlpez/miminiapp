import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parsers } from 'prettier/plugins/yaml';
import { describe, expect, it } from 'vitest';

type Value = string | number | boolean | null | Value[] | Mapping;
interface Mapping {
  [key: string]: Value;
}
interface YamlNode {
  type: string;
  value?: string;
  children?: YamlNode[];
  anchor?: unknown;
  tag?: unknown;
}

const root = resolve(import.meta.dirname, '../..');
const workflowDirectory = resolve(root, '.github/workflows');
const actionPins: Record<string, string> = {
  'actions/checkout': '3d3c42e5aac5ba805825da76410c181273ba90b1',
  'actions/setup-node': '949feb2413d6458794dcd2491c4babbbce0c15c1',
  'actions/upload-artifact': 'cf430e030ddbb5b0abf93d22962f4752f3646cd9',
  'actions/download-artifact': '9000827ccba6bdab643e8b6fd33ac0654aef8333',
};

function mapping(value: Value | undefined, label: string): Mapping {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}: expected a mapping`);
  }
  return value;
}

// Prettier is an existing direct dependency. Decode its YAML AST structurally so
// comments, quoting and key order cannot disguise an enabled publishing job.
// Unknown YAML constructs fail closed rather than being silently ignored.
function decode(node: YamlNode): Value {
  if (node.anchor || node.tag)
    throw new Error('YAML anchors and tags are not allowed');
  const children = node.children ?? [];
  switch (node.type) {
    case 'root':
      if (children.length !== 1)
        throw new Error('Exactly one YAML document is required');
      return decode(children[0]);
    case 'document': {
      const head = children.find((child) => child.type === 'documentHead');
      const body = children.find((child) => child.type === 'documentBody');
      if (head?.children?.length || !body)
        throw new Error('Unsupported YAML document');
      return decode(body);
    }
    case 'documentBody':
    case 'mappingKey':
    case 'mappingValue':
    case 'sequenceItem':
    case 'flowSequenceItem':
      if (children.length > 1) throw new Error('Unexpected YAML wrapper');
      return children.length === 0 ? null : decode(children[0]);
    case 'mapping':
    case 'flowMapping': {
      const result: Mapping = Object.create(null) as Mapping;
      for (const item of children) {
        if (!['mappingItem', 'flowMappingItem'].includes(item.type)) {
          throw new Error(`Unsupported mapping entry: ${item.type}`);
        }
        const [keyNode, valueNode] = item.children ?? [];
        if (!keyNode || !valueNode) throw new Error('Incomplete YAML mapping');
        const key = decode(keyNode);
        if (
          typeof key !== 'string' ||
          key === '<<' ||
          Object.hasOwn(result, key)
        ) {
          throw new Error('Duplicate or unsupported YAML key');
        }
        result[key] = decode(valueNode);
      }
      return result;
    }
    case 'sequence':
    case 'flowSequence':
      return children.map(decode);
    case 'plain':
      if (node.value === 'true') return true;
      if (node.value === 'false') return false;
      if (node.value === 'null' || node.value === '~') return null;
      if (/^\d+$/.test(node.value ?? '')) return Number(node.value);
      return node.value ?? '';
    case 'quoteSingle':
    case 'quoteDouble':
    case 'blockLiteral':
    case 'blockFolded':
      return node.value ?? '';
    default:
      throw new Error(`Unsupported YAML node: ${node.type}`);
  }
}

async function parseYaml(source: string): Promise<Mapping> {
  // This bundled parser only consumes the source; Prettier's general Parser
  // interface also describes formatting options used by other parsers.
  const parse = parsers.yaml.parse as (
    text: string,
  ) => YamlNode | Promise<YamlNode>;
  const ast = await parse(source);
  return mapping(decode(ast), 'workflow');
}

function requireCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new Error(message);
}

function checkPermissions(value: Value | undefined): void {
  for (const [permission, level] of Object.entries(
    mapping(value, 'permissions'),
  )) {
    requireCondition(
      ['contents', 'actions', 'pull-requests', 'checks'].includes(permission) &&
        level === 'read',
      `Unexpected token permission: ${permission}:${String(level)}`,
    );
  }
}

function auditWorkflow(workflow: Mapping): void {
  const triggers = mapping(workflow.on, 'on');
  requireCondition(
    Object.keys(triggers).every((trigger) =>
      ['pull_request', 'push', 'workflow_dispatch'].includes(trigger),
    ),
    'Unsafe workflow event',
  );
  checkPermissions(workflow.permissions);
  requireCondition(
    !/secrets\./.test(JSON.stringify(workflow.env ?? {})),
    'Global secrets',
  );
  const jobs = mapping(workflow.jobs, 'jobs');

  for (const [jobId, jobValue] of Object.entries(jobs)) {
    const job = mapping(jobValue, jobId);
    requireCondition(job['runs-on'] === 'ubuntu-24.04', 'Runner must be fixed');
    if (job.permissions) checkPermissions(job.permissions);
    requireCondition(
      !job.uses,
      'Reusable workflow permissions require a separate review',
    );
    requireCondition(
      Array.isArray(job.steps),
      'Every job must have explicit steps',
    );
    const steps = job.steps.map((step) => mapping(step, 'step'));
    const serialized = JSON.stringify(job);
    const publisher =
      Object.hasOwn(job, 'environment') ||
      /scripts\/release\/cli\.ts publish\b|\bwrangler\s+(deploy|rollback|publish)/.test(
        serialized,
      );

    for (const step of steps) {
      if (!step.uses) continue;
      requireCondition(
        typeof step.uses === 'string',
        'Action must have a fixed reference',
      );
      const [action, pin, extra] = step.uses.split('@');
      requireCondition(
        !extra && actionPins[action] === pin,
        `Unapproved action: ${step.uses}`,
      );
      const options = mapping(step.with, `with ${action}`);
      if (action === 'actions/checkout') {
        requireCondition(
          options['persist-credentials'] === false,
          'Persistent Git credential',
        );
      }
      if (action === 'actions/setup-node') {
        requireCondition(
          options['node-version'] === '24.22.2',
          'Node version must be fixed',
        );
        requireCondition(
          options['package-manager-cache'] === false,
          'Implicit dependency cache',
        );
      }
      if (action === 'actions/download-artifact') {
        requireCondition(
          options['artifact-ids'],
          'Artifact download must identify immutable IDs',
        );
        requireCondition(
          options['digest-mismatch'] === 'error',
          'Artifact digest is not enforced',
        );
        requireCondition(
          !options.name && !options.pattern,
          'Mutable artifact name selection',
        );
      }
      if (action === 'actions/upload-artifact') {
        requireCondition(
          [7, 30].includes(options['retention-days'] as number),
          'Unexpected artifact retention',
        );
        if (options['retention-days'] === 30) {
          requireCondition(
            String(options.name).endsWith('-${{ github.run_attempt }}'),
            'Release artifact must identify its immutable run attempt',
          );
          requireCondition(
            !options.overwrite,
            'A rerun must preserve prior release artifacts',
          );
        }
      }
    }

    if (!publisher) {
      requireCondition(
        !/secrets\./.test(serialized),
        'Unprivileged job references secrets',
      );
      continue;
    }
    requireCondition(
      job.if === '${{ false }}',
      'Publishing job is active in Phase A',
    );
    const concurrency = mapping(job.concurrency, 'publisher concurrency');
    requireCondition(
      concurrency.group === 'miminiapp-publicacion',
      'Publication lock differs',
    );
    requireCondition(
      concurrency['cancel-in-progress'] === false,
      'Publication may be interrupted',
    );
    requireCondition(
      typeof job.needs === 'string',
      'Publisher must depend on an unprivileged gate',
    );
    const gate = mapping(jobs[job.needs], 'publisher gate');
    requireCondition(
      !gate.environment && !/secrets\./.test(JSON.stringify(gate)),
      'Privileged gate',
    );
    requireCondition(
      ['staging', 'production', '${{ inputs.target }}'].includes(
        String(job.environment),
      ),
      'Unexpected publication environment',
    );
    const publishIndex = steps.findIndex((step) =>
      /scripts\/release\/cli\.ts publish\b/.test(String(step.run)),
    );
    requireCondition(
      publishIndex >= 0,
      'Publisher lacks a concrete guarded operation',
    );
    const beforePublish = steps.slice(0, publishIndex);
    requireCondition(
      beforePublish.some((step) => String(step.run).includes('assert-phase-b')),
      'Missing committed authorization guard',
    );
    requireCondition(
      beforePublish.some((step) =>
        /check-(merged|rollback)/.test(String(step.run)),
      ),
      'Missing current candidate recheck under the publication lock',
    );
    requireCondition(
      beforePublish.some((step) => /cli\.ts verify /.test(String(step.run))),
      'Missing artifact verification',
    );
    for (const step of steps) {
      if (!/secrets\./.test(JSON.stringify(step))) continue;
      requireCondition(
        step === steps[publishIndex],
        'Secret exposed outside publication step',
      );
      requireCondition(
        !Object.hasOwn(job, 'env'),
        'Publisher secrets must be scoped to the guarded publication step',
      );
    }
  }
}

async function readWorkflow(name: string): Promise<Mapping> {
  return parseYaml(readFileSync(resolve(workflowDirectory, name), 'utf8'));
}

function readGitHubRequest(name: string): Mapping {
  return mapping(
    JSON.parse(
      readFileSync(resolve(root, 'deploy/github', name), 'utf8'),
    ) as Value,
    name,
  );
}

// These files describe requests awaiting authenticated application and negative
// server-side tests. Passing this audit does not prove remote protection exists.
function auditGitHubRequests(
  repository: Mapping,
  protections: Record<'staging' | 'main', Mapping>,
  environment: Mapping,
): void {
  requireCondition(
    repository.allow_auto_merge === false,
    'Auto-merge must stay disabled',
  );
  requireCondition(
    !Object.hasOwn(repository, 'default_branch'),
    'Default branch change is not authorized',
  );
  requireCondition(
    repository.allow_merge_commit === true &&
      repository.allow_squash_merge === false &&
      repository.allow_rebase_merge === false &&
      repository.delete_branch_on_merge === false,
    'Preserve merge ancestry and protected branches',
  );
  for (const branch of ['staging', 'main'] as const) {
    const protection = protections[branch];
    const checks = mapping(
      protection.required_status_checks,
      `${branch} checks`,
    );
    requireCondition(
      checks.strict === true,
      `${branch}: strict must remain true`,
    );
    const required = branch === 'main' ? ['quality', 'promotion'] : ['quality'];
    requireCondition(
      JSON.stringify(checks.contexts) === JSON.stringify(required),
      `${branch}: required checks differ`,
    );
    requireCondition(
      protection.enforce_admins === true,
      `${branch}: administrator bypass`,
    );
    requireCondition(
      protection.allow_force_pushes === false,
      `${branch}: force push allowed`,
    );
    requireCondition(
      protection.allow_deletions === false,
      `${branch}: branch deletion allowed`,
    );
    const reviews = mapping(
      protection.required_pull_request_reviews,
      `${branch} PR requirement`,
    );
    requireCondition(
      reviews.required_approving_review_count === 0 &&
        reviews.require_code_owner_reviews === false &&
        reviews.require_last_push_approval === false,
      `${branch}: solo owner would need another reviewer`,
    );
    const bypass = reviews.bypass_pull_request_allowances;
    requireCondition(
      !bypass ||
        Object.values(mapping(bypass, 'PR bypass')).every(
          (value) => Array.isArray(value) && value.length === 0,
        ),
      `${branch}: PR bypass is not approved`,
    );
  }
  requireCondition(
    Array.isArray(environment.reviewers) &&
      environment.reviewers.length === 0 &&
      environment.wait_timer === 0,
    'Deployment must not require a second human approval',
  );
  const policy = mapping(
    environment.deployment_branch_policy,
    'Environment branch policy',
  );
  requireCondition(
    policy.protected_branches === false &&
      policy.custom_branch_policies === true,
    'Environment must request explicit per-branch allowlists',
  );
}

describe('Phase A deployment safety', () => {
  it('keeps the committed authorization disabled and the destinations separate', () => {
    const policy = JSON.parse(
      readFileSync(resolve(root, '.github/deployment-policy.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(policy).toMatchObject({
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
    });
  });

  it('audits every real workflow structurally, including all inactive publishers', async () => {
    const files = readdirSync(workflowDirectory).filter((name) =>
      /\.ya?ml$/.test(name),
    );
    expect(files.sort()).toEqual([
      'ci.yml',
      'production.yml',
      'promotion.yml',
      'rollback.yml',
      'staging.yml',
    ]);
    for (const file of files) auditWorkflow(await readWorkflow(file));
  });

  it('runs the complete quality suite on PRs and the Phase A bootstrap feature push', async () => {
    const ci = await readWorkflow('ci.yml');
    const triggers = mapping(ci.on, 'CI triggers');
    expect(mapping(triggers.pull_request, 'PR').branches).toEqual([
      'staging',
      'main',
    ]);
    expect(mapping(triggers.push, 'push').branches).toEqual(['feature/i03*']);
    const quality = mapping(mapping(ci.jobs, 'jobs').quality, 'quality');
    expect(quality.if).toBeUndefined();
    expect(JSON.stringify(quality)).toContain('npm run verify');
    expect(JSON.stringify(quality)).toContain(
      'playwright install --with-deps chromium',
    );
    expect(JSON.stringify(quality)).not.toMatch(
      /channel|executablePath|CHROMIUM_EXECUTABLE/,
    );
  });

  it('checks every main PR with trusted base code, including invalid heads and forks', async () => {
    const promotion = await readWorkflow('promotion.yml');
    expect(
      mapping(mapping(promotion.on, 'triggers').pull_request, 'PR').branches,
    ).toEqual(['main']);
    const job = mapping(mapping(promotion.jobs, 'jobs').promotion, 'promotion');
    expect(job.if).toBeUndefined();
    const steps = (job.steps as Value[]).map((step) => mapping(step, 'step'));
    const checkout = steps.find((step) =>
      String(step.uses).startsWith('actions/checkout@'),
    );
    expect(mapping(checkout?.with, 'checkout').ref).toBe(
      '${{ github.event.pull_request.base.sha }}',
    );
    const gate = steps.find((step) =>
      String(step.run).includes('check-promotion'),
    );
    expect(gate).toBeDefined();
    expect(gate?.if).toBeUndefined();
  });

  it('permits only explicit rollback destinations and a previous trusted run', async () => {
    const workflow = await readWorkflow('rollback.yml');
    const inputs = mapping(
      mapping(mapping(workflow.on, 'triggers').workflow_dispatch, 'dispatch')
        .inputs,
      'inputs',
    );
    expect(Object.keys(inputs).sort()).toEqual(['prior-run-id', 'target']);
    expect(mapping(inputs.target, 'target')).toMatchObject({
      type: 'choice',
      options: ['staging', 'production'],
      required: true,
    });
  });

  it('also disables preparation jobs in every publishing workflow during Phase A', async () => {
    for (const file of ['staging.yml', 'production.yml', 'rollback.yml']) {
      const workflow = await readWorkflow(file);
      for (const job of Object.values(mapping(workflow.jobs, 'jobs'))) {
        expect(mapping(job, 'job').if).toBe('${{ false }}');
      }
    }
  });

  it('keeps the desired GitHub requests safe for one owner without changing the default branch', () => {
    auditGitHubRequests(
      readGitHubRequest('repository.json'),
      {
        staging: readGitHubRequest('staging-protection.json'),
        main: readGitHubRequest('main-protection.json'),
      },
      readGitHubRequest('environment.json'),
    );
  });

  it.each([
    [
      'relax main freshness',
      'main',
      'required_status_checks',
      'strict',
      false,
      'main: strict must remain true',
    ],
    [
      'relax staging freshness',
      'staging',
      'required_status_checks',
      'strict',
      false,
      'staging: strict must remain true',
    ],
    [
      'require another reviewer',
      'main',
      'required_pull_request_reviews',
      'required_approving_review_count',
      1,
      'solo owner would need another reviewer',
    ],
    [
      'remove the PR requirement',
      'staging',
      null,
      'required_pull_request_reviews',
      null,
      'expected a mapping',
    ],
    [
      'allow administrator bypass',
      'main',
      null,
      'enforce_admins',
      false,
      'administrator bypass',
    ],
    [
      'allow force pushes',
      'staging',
      null,
      'allow_force_pushes',
      true,
      'force push allowed',
    ],
    [
      'allow branch deletion',
      'main',
      null,
      'allow_deletions',
      true,
      'branch deletion allowed',
    ],
    [
      'remove promotion check',
      'main',
      'required_status_checks',
      'contexts',
      ['quality'],
      'required checks differ',
    ],
    [
      'allow a PR bypass actor',
      'main',
      'required_pull_request_reviews',
      'bypass_pull_request_allowances',
      { users: ['aalexlpez'] },
      'PR bypass is not approved',
    ],
  ] as const)(
    'rejects a proposed branch-protection regression: %s',
    (_label, branch, section, key, value, error) => {
      const protections = {
        staging: readGitHubRequest('staging-protection.json'),
        main: readGitHubRequest('main-protection.json'),
      };
      const target = section
        ? mapping(protections[branch][section], section)
        : protections[branch];
      target[key] = structuredClone(value) as Value;
      expect(() =>
        auditGitHubRequests(
          readGitHubRequest('repository.json'),
          protections,
          readGitHubRequest('environment.json'),
        ),
      ).toThrow(error);
    },
  );

  it.each([
    [
      'enable auto-merge',
      'repository',
      'allow_auto_merge',
      true,
      'Auto-merge must stay disabled',
    ],
    [
      'change the default branch prematurely',
      'repository',
      'default_branch',
      'main',
      'Default branch change is not authorized',
    ],
    [
      'require an Environment reviewer',
      'environment',
      'reviewers',
      [{ type: 'User', id: 1 }],
      'second human approval',
    ],
    [
      'allow all protected branches in both Environments',
      'environment',
      'deployment_branch_policy',
      { protected_branches: true, custom_branch_policies: false },
      'explicit per-branch allowlists',
    ],
  ] as const)(
    'rejects a proposed repository or Environment regression: %s',
    (_label, target, key, value, error) => {
      const repository = readGitHubRequest('repository.json');
      const environment = readGitHubRequest('environment.json');
      (target === 'repository' ? repository : environment)[key] =
        structuredClone(value) as Value;
      expect(() =>
        auditGitHubRequests(
          repository,
          {
            staging: readGitHubRequest('staging-protection.json'),
            main: readGitHubRequest('main-protection.json'),
          },
          environment,
        ),
      ).toThrow(error);
    },
  );

  it.each([
    [
      'enable publication',
      (workflow: Mapping) => {
        mapping(mapping(workflow.jobs, 'jobs')['remote-test'], 'publisher').if =
          '${{ vars.ENABLE }}';
      },
      'Publishing job is active',
    ],
    [
      'allow publication cancellation',
      (workflow: Mapping) => {
        const job = mapping(
          mapping(workflow.jobs, 'jobs')['remote-test'],
          'publisher',
        );
        mapping(job.concurrency, 'concurrency')['cancel-in-progress'] = true;
      },
      'Publication may be interrupted',
    ],
    [
      'grant token writes',
      (workflow: Mapping) => {
        mapping(workflow.permissions, 'permissions').contents = 'write';
      },
      'Unexpected token permission',
    ],
    [
      'run privileged PR events',
      (workflow: Mapping) => {
        mapping(workflow.on, 'triggers').pull_request_target = null;
      },
      'Unsafe workflow event',
    ],
    [
      'expose a secret to the preparation gate',
      (workflow: Mapping) => {
        mapping(mapping(workflow.jobs, 'jobs').prepare, 'prepare').env = {
          TOKEN: '${{ secrets.CLOUDFLARE_API_TOKEN }}',
        };
      },
      'Unprivileged job references secrets',
    ],
    [
      'select a mutable artifact name',
      (workflow: Mapping) => {
        const job = mapping(
          mapping(workflow.jobs, 'jobs')['remote-test'],
          'publisher',
        );
        const steps = (job.steps as Value[]).map((step) =>
          mapping(step, 'step'),
        );
        const step = steps.find((entry) =>
          String(entry.uses).startsWith('actions/download-artifact@'),
        );
        mapping(step?.with, 'with').name = 'latest';
      },
      'Mutable artifact name selection',
    ],
    [
      'use a moving action tag',
      (workflow: Mapping) => {
        const job = mapping(mapping(workflow.jobs, 'jobs').prepare, 'prepare');
        mapping((job.steps as Value[])[0], 'step').uses = 'actions/checkout@v7';
      },
      'Unapproved action',
    ],
  ] as const)(
    'rejects a workflow mutation: %s',
    async (_label, mutate, error) => {
      const workflow = await readWorkflow('staging.yml');
      mutate(workflow);
      expect(() => auditWorkflow(workflow)).toThrow(error);
    },
  );

  it.each([
    'jobs: &jobs {}\nother: *jobs\n',
    'jobs: {}\njobs: {}\n',
    'jobs: {}\n---\njobs: {}\n',
    'jobs: !!map {}\n',
  ])(
    'rejects unsupported or ambiguous YAML rather than skipping its contents',
    async (source) => {
      await expect(parseYaml(source)).rejects.toThrow();
    },
  );
});
