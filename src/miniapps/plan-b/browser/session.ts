import { parseSession, type PlanSession } from '../domain/session-state';

export const sessionKey = 'miminiapp.plan-b.v1';
export type SessionWarning = 'invalid' | 'unavailable' | 'delete-failed';
export type SessionStoragePort = Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
>;

export function createSessionStore(resolveStorage: () => SessionStoragePort) {
  let memoryOnly = false;
  let warnings: SessionWarning[] = [];
  const warn = (warning: SessionWarning) => {
    if (!warnings.includes(warning)) warnings.push(warning);
  };
  function remove() {
    try {
      resolveStorage().removeItem(sessionKey);
      return true;
    } catch {
      memoryOnly = true;
      warn('delete-failed');
      return false;
    }
  }
  return {
    load(): PlanSession | null {
      let raw: string | null;
      try {
        raw = resolveStorage().getItem(sessionKey);
      } catch {
        memoryOnly = true;
        warn('unavailable');
        return null;
      }
      if (raw === null) return null;
      const session = parseSession(raw);
      if (session) return session;
      warn('invalid');
      remove();
      return null;
    },
    save(session: PlanSession) {
      if (memoryOnly) return;
      try {
        resolveStorage().setItem(sessionKey, JSON.stringify(session));
      } catch {
        memoryOnly = true;
        warn('unavailable');
        remove();
      }
    },
    clear() {
      warnings = [];
      remove();
    },
    status() {
      return { memoryOnly, warnings: [...warnings] };
    },
  };
}
