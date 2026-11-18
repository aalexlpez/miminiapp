import { test, expect } from './helpers/fixtures';
import { devices } from '@playwright/test';
import { getPlanCopy } from '../i18n/copy';
import { sessionKey } from '../browser/session';
import { enterPlanResult, openCalendar } from './helpers/journey';

test.use({ entryKind: 'app' });
test.describe('native keyboard time editor', () => {
  test.use({
    isMobile: false,
    hasTouch: false,
    userAgent: devices['Desktop Chrome'].userAgent,
    viewport: devices['Desktop Chrome'].viewport,
    deviceScaleFactor: 1,
  });
  test('rejects a partial native hour without overwriting the prepared schedule or blocking the plan', async ({
    page,
  }) => {
    const copy = getPlanCopy('es');
    await page.goto('/es/apps/plan-b/');
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.flow.nextOther, exact: true })
      .click();
    await enterPlanResult(page, copy);
    await openCalendar(page, copy);
    const time = page.locator('#pb-time');
    await time.fill('');
    await time.press('1');
    expect(await time.evaluate((el: HTMLInputElement) => el.value)).toBe('');
    expect(
      await time.evaluate((el: HTMLInputElement) => el.validity.badInput),
    ).toBe(true);
    await page
      .getByRole('button', { name: copy.flow.schedulePrepare, exact: true })
      .click();
    await expect(page.getByRole('alert')).toHaveText(copy.ui.errorTime);
    await expect(time).toBeFocused();
    await expect(page.getByTestId('plan-sentence')).toContainText(
      copy.example.action,
    );
    expect(
      (
        await page.evaluate(
          (key) => JSON.parse(sessionStorage.getItem(key)!),
          sessionKey,
        )
      ).inputs.time,
    ).toBe('20:00');
    await time.fill('21:30');
    await page
      .getByRole('button', { name: copy.flow.schedulePrepare, exact: true })
      .click();
    expect(
      (
        await page.evaluate(
          (key) => JSON.parse(sessionStorage.getItem(key)!),
          sessionKey,
        )
      ).inputs.time,
    ).toBe('21:30');
    await page.reload();
    await openCalendar(page, copy);
    await expect(page.locator('#pb-time')).toHaveValue('21:30');
  });
});
for (const locale of ['es', 'en'] as const) {
  test(`${locale}: reset recaptures the month only when a new plan actually starts`, async ({
    page,
  }) => {
    const copy = getPlanCopy(locale);
    await page.clock.install({ time: new Date(2026, 0, 31, 12) });
    await page.goto(`/${locale}/apps/plan-b/`);
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.flow.nextOther, exact: true })
      .click();
    await page.clock.setFixedTime(new Date(2026, 1, 1, 12));
    await enterPlanResult(page, copy);
    expect(
      (
        await page.evaluate(
          (key) => JSON.parse(sessionStorage.getItem(key)!),
          sessionKey,
        )
      ).narrative.startedOn.month,
    ).toBe(1);
    await page
      .getByRole('button', { name: copy.ui.reset, exact: true })
      .click();
    await expect(page.locator('#pb-step-title')).toHaveText(copy.ui.question);
    expect(
      await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
    ).toBeNull();
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
      .click();
    await expect(page.locator('.pb-question-hint')).toContainText(
      locale === 'es' ? 'marzo' : 'March',
    );
    expect(
      (
        await page.evaluate(
          (key) => JSON.parse(sessionStorage.getItem(key)!),
          sessionKey,
        )
      ).narrative.startedOn.month,
    ).toBe(2);
  });
}

test('captures the real first-edit date across a month boundary without stealing input focus', async ({
  page,
}) => {
  const copy = getPlanCopy('es');
  await page.clock.install({ time: new Date(2026, 0, 31, 23, 59) });
  await page.goto('/es/apps/plan-b/');
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-ready',
    'true',
  );
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
  ).toBeNull();
  await page.clock.setFixedTime(new Date(2026, 1, 1, 0, 1));
  const purpose = page.getByLabel(copy.ui.goalLabel, { exact: true });
  await purpose.fill('Leer más');
  await expect(purpose).toBeFocused();
  await expect(page.locator('#pb-step-title')).toHaveText(copy.ui.question);
  expect(
    (
      await page.evaluate(
        (key) => JSON.parse(sessionStorage.getItem(key)!),
        sessionKey,
      )
    ).narrative.startedOn.month,
  ).toBe(2);
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .click();
  await expect(page.locator('.pb-question-hint')).toContainText('marzo');
});
