import { validateTranslationParity } from '../../../i18n/validation';
import type { Locale } from '../../../lib/locales';
import { es } from './es';
import { en } from './en';

validateTranslationParity(es, en);
export type PlanCopy = typeof es;
export function getPlanCopy(locale: Locale): PlanCopy {
  return { es, en }[locale];
}
/** Single pass keeps literal placeholder-shaped user text intact. */
export function fill(
  template: string,
  values: Readonly<Record<string, string | number>>,
) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    String(values[key] ?? placeholder),
  );
}
