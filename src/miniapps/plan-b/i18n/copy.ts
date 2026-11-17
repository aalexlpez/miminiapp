import { validateTranslationParity } from '../../../i18n/validation';
import type { Locale } from '../../../lib/locales';
import { es } from './es';
import { en } from './en';

validateTranslationParity(es, en);
export type PlanCopy = typeof es;
export function getPlanCopy(locale: Locale): PlanCopy {
  return { es, en }[locale];
}
export { fill } from './fill';
