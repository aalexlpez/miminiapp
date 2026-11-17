import {
  validateRegistry,
  type MiniappRegistration,
} from '../lib/miniapp-registry';
import { metadata as planB } from './plan-b/metadata';

// A real tool is added only after its own approval. Test fixtures live in tests/.
// Published entry: { descriptor: metadata, loadEntry: () => import('./tool/entry.astro') }
// Step-by-step guide: docs/guides/miniapps.md
export const miniappRegistry = validateRegistry([
  { descriptor: planB, loadEntry: () => import('./plan-b/entry.astro') },
] satisfies readonly MiniappRegistration[]);
