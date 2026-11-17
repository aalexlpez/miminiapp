import { expect, type Page } from '@playwright/test';
import type { Locale } from '../../../../lib/locales';
import { getPlanCopy } from '../../i18n/copy';
import { sessionKey } from '../../browser/session';

/** Shared by the real local candidate and the identity-guarded remote suite. */
export async function verifyPlanJourney(page: Page, locale: Locale) {
  const copy = getPlanCopy(locale);
  const response = await page.goto(`/${locale}/apps/plan-b/`);
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    locale === 'es' ? 'Plan B' : 'Bad Day Plan',
  );
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-ready',
    'true',
  );
  await page.evaluate(() => {
    sessionStorage.setItem('plan-b-test-neighbour', 'keep');
    localStorage.setItem('miminiapp.appearance', 'dark');
  });
  await page
    .getByRole('button', { name: copy.ui.exampleButton, exact: true })
    .click();
  await expect(page.getByLabel(copy.ui.goalLabel, { exact: true })).toHaveValue(
    copy.example.purpose,
  );
  await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.ui.viewPlan, exact: true })
    .click();
  const sentence =
    locale === 'es'
      ? `Si ${copy.example.situation}, entonces ${copy.example.action}.`
      : `If ${copy.example.situation}, then ${copy.example.action}.`;
  await expect(page.getByTestId('plan-sentence')).toHaveText(sentence);
  await expect(
    page.getByRole('img', { name: copy.exports.imageReady }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: copy.ui.catalogue }),
  ).toHaveAttribute('href', `/${locale}/#catalogo`);
  await page.reload();
  await expect(page.getByTestId('plan-sentence')).toHaveText(sentence);
  await page.getByRole('button', { name: copy.ui.reset, exact: true }).click();
  await expect(
    page.getByRole('button', { name: copy.ui.start, exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
  ).toBeNull();
  expect(
    await page.evaluate(() => sessionStorage.getItem('plan-b-test-neighbour')),
  ).toBe('keep');
  expect(
    await page.evaluate(() => localStorage.getItem('miminiapp.appearance')),
  ).toBe('dark');
  await page.evaluate(() => sessionStorage.removeItem('plan-b-test-neighbour'));
}
