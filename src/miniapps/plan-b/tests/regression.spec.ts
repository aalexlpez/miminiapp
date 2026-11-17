import { test, expect } from './helpers/fixtures';
import { devices } from '@playwright/test';
import { getPlanCopy } from '../i18n/copy';

test.use({ entryKind: 'app' });

test.describe('native keyboard time editor', () => {
  // Touch pickers do not expose the partial text editor that triggers this bug.
  test.use({
    isMobile: false,
    hasTouch: false,
    userAgent: devices['Desktop Chrome'].userAgent,
    viewport: devices['Desktop Chrome'].viewport,
    deviceScaleFactor: 1,
  });

  test('rejects a partial native hour rather than silently treating it as omitted', async ({
    page,
  }) => {
    const copy = getPlanCopy('es');
    await page.goto('/es/apps/plan-b/');
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    const time = page.locator('#pb-time');
    await time.fill('');
    await time.press('1');
    expect(
      await time.evaluate((element: HTMLInputElement) => element.value),
    ).toBe('');
    expect(
      await time.evaluate(
        (element: HTMLInputElement) => element.validity.badInput,
      ),
    ).toBe(true);
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
    await expect(page.getByRole('alert')).toHaveText(copy.ui.errorTime);
    await expect(time).toBeFocused();
    await expect(page.getByTestId('plan-sentence')).toHaveCount(0);
    await time.fill('21:30');
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
    await expect(page.getByTestId('plan-sentence')).toContainText(
      copy.example.action,
    );
  });
});

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: resets to the new month's home without changing the completed session's date`, async ({
    page,
  }) => {
    const copy = getPlanCopy(locale);
    await page.clock.install({ time: new Date(2026, 0, 31, 12) });
    await page.goto(`/${locale}/apps/plan-b/`);
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await page.clock.setFixedTime(new Date(2026, 1, 1, 12));
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
    await expect(page.locator('.pb-stamp')).toContainText(
      locale === 'es' ? 'febrero' : 'February',
    );
    await page
      .getByRole('button', { name: copy.ui.reset, exact: true })
      .click();
    await expect(page.locator('#pb-step-title')).toContainText(
      locale === 'es' ? 'marzo' : 'March',
    );
  });
}
