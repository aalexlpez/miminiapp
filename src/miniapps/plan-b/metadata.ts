import type { MiniappDescriptor } from '../../lib/miniapp-registry';

export const metadata = {
  id: 'plan-b',
  slug: 'plan-b',
  status: 'draft',
  category: 'everyday',
  copy: {
    es: {
      title: 'Plan B',
      description:
        'Prepara un plan para el día en que tu propósito se complique.',
    },
    en: {
      title: 'Bad Day Plan',
      description: 'Make a plan for the day your goal gets difficult.',
    },
  },
} as const satisfies MiniappDescriptor;
