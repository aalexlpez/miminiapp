import type { MiniappDescriptor } from '../../lib/miniapp-registry';
import { planBIcon } from './domain/brand';

export const metadata = {
  id: 'plan-b',
  slug: 'plan-b',
  status: 'published',
  publishedAt: '2026-11-17',
  category: 'everyday',
  presentation: 'focused',
  icon: planBIcon,
  copy: {
    es: {
      title: 'Plan B',
      description: 'Un plan para seguir, incluso en un mal día.',
    },
    en: {
      title: 'Bad Day Plan',
      description: 'A way to keep going, even on a bad day.',
    },
  },
} as const satisfies MiniappDescriptor;
