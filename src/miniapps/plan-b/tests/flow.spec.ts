import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/fixtures';
import { sessionKey } from '../browser/session';
import { getPlanCopy } from '../i18n/copy';
import { enterPlanResult, openCalendar } from './helpers/journey';

test.use({ entryKind: 'app' });
async function open(
  page: import('@playwright/test').Page,
  locale: 'es' | 'en' = 'es',
) {
  await page.goto(`/${locale}/apps/plan-b/`);
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-ready',
    'true',
  );
}
for (const locale of ['es', 'en'] as const) {
  test(`completes the ${locale} example with focus, Back, recovery, and isolated reset`, async ({
    page,
  }) => {
    const copy = getPlanCopy(locale);
    await open(page, locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('.miniapp-page')).toHaveAttribute(
      'data-presentation',
      'focused',
    );
    await expect(
      page.getByLabel(copy.ui.goalLabel, { exact: true }),
    ).toBeEnabled();
    expect(
      await page.evaluate(() => sessionStorage.getItem('miminiapp.plan-b.v1')),
    ).toBeNull();
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await expect(page.locator('#pb-step-title')).toBeFocused();
    await expect(
      page.getByLabel(copy.ui.goalLabel, { exact: true }),
    ).toHaveValue(copy.example.purpose);
    await page
      .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await expect(
      page.getByLabel(`${copy.ui.if} — ${copy.ui.situationLabel}`, {
        exact: true,
      }),
    ).toHaveValue(copy.example.situation);
    await expect(
      page.getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, {
        exact: true,
      }),
    ).toHaveCount(0);
    await enterPlanResult(page, copy);
    const sentence = `${copy.ui.if} ${copy.example.situation}, ${copy.ui.then} ${copy.example.action}.`;
    await expect(page.getByTestId('plan-sentence')).toHaveText(sentence);
    await page.reload();
    await expect(page.getByTestId('plan-sentence')).toHaveText(sentence);
    await page
      .getByRole('button', { name: copy.exports.editPlan, exact: true })
      .click();
    await expect(
      page.getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, {
        exact: true,
      }),
    ).toHaveValue(copy.example.action);
    await enterPlanResult(page, copy);
    await page
      .getByRole('link', { name: copy.ui.catalogue, exact: true })
      .click();
    await page.goBack();
    await expect(page.getByTestId('plan-sentence')).toBeVisible();
    await page
      .getByRole('button', { name: copy.ui.reset, exact: true })
      .click();
    expect(
      await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
    ).toBeNull();
    await page.reload();
    await expect(
      page.getByLabel(copy.ui.goalLabel, { exact: true }),
    ).toHaveValue('');
  });
}

test('retains literal ES example and January narrative through locale/month changes', async ({
  page,
}) => {
  const es = getPlanCopy('es'),
    en = getPlanCopy('en');
  await page.clock.install({ time: new Date(2026, 0, 31, 12) });
  await page.addInitScript(() =>
    localStorage.setItem('miminiapp.appearance', 'dark'),
  );
  await open(page);
  await page
    .getByRole('button', { name: es.ui.exampleButton, exact: true })
    .click();
  await expect(page.locator('#pb-step-title')).toHaveText(
    es.ui.januaryQuestion,
  );
  await page.clock.setFixedTime(new Date(2026, 1, 1, 12));
  await page.locator('header a[hreflang="en"]').click();
  await expect(page.getByLabel(en.ui.goalLabel, { exact: true })).toHaveValue(
    es.example.purpose,
  );
  await expect(page.getByText(en.ui.exampleTag, { exact: true })).toBeVisible();
  await expect(page.locator('#pb-step-title')).toHaveText(
    en.ui.januaryQuestion,
  );
  await page
    .getByRole('button', { name: en.flow.nextPurpose, exact: true })
    .click();
  await expect(page.locator('.pb-question-hint')).toContainText('February');
  await page
    .getByRole('button', { name: en.obstacles.time, exact: true })
    .click();
  await expect(page.getByLabel('If — Situation', { exact: true })).toHaveValue(
    es.example.situation,
  );
  await page
    .getByRole('button', { name: en.flow.nextSituation, exact: true })
    .click();
  await page.locator('.pb-ideas > summary').click();
  await page
    .getByRole('button', { name: en.suggestions.action.time[0], exact: true })
    .click();
  await expect(page.getByText(en.ui.exampleTag, { exact: true })).toHaveCount(
    0,
  );
  expect(
    (
      await page.evaluate(
        (key) => JSON.parse(sessionStorage.getItem(key)!),
        sessionKey,
      )
    ).inputs.situation,
  ).toBe(es.example.situation);
  expect(
    await page.evaluate(() => localStorage.getItem('miminiapp.appearance')),
  ).toBe('dark');
});

test('validates Other, separate fields and optional days without transmitting private text', async ({
  page,
}) => {
  const copy = getPlanCopy('es'),
    sentinel = 'PB_PRIVATE_SENTINEL',
    sent: string[] = [];
  page.on('request', (r) => sent.push(r.url() + (r.postData() ?? '')));
  page.on('console', (m) => sent.push(m.text()));
  await open(page);
  await page.getByLabel(copy.ui.goalLabel, { exact: true }).fill('ab');
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('3');
  await page.getByLabel(copy.ui.goalLabel, { exact: true }).fill(sentinel);
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.obstacles.other, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.flow.nextOther, exact: true })
    .click();
  await expect(
    page.getByLabel(copy.ui.otherLabel, { exact: true }),
  ).toBeFocused();
  await page
    .getByLabel(copy.ui.otherLabel, { exact: true })
    .fill('Mis horarios');
  await page
    .getByRole('button', { name: copy.flow.nextOther, exact: true })
    .click();
  await page
    .getByLabel('Si — Situación', { exact: true })
    .fill(`veo <b>${sentinel}</b>`);
  await page
    .getByRole('button', { name: copy.flow.nextSituation, exact: true })
    .click();
  await page
    .getByLabel('entonces — Acción', { exact: true })
    .fill('leo una página');
  await enterPlanResult(page, copy);
  await expect(page.getByTestId('plan-sentence')).toHaveText(
    `Si veo <b>${sentinel}</b>, entonces leo una página.`,
  );
  await expect(page.getByTestId('plan-sentence').locator('b')).toHaveCount(0);
  await openCalendar(page, copy);
  const time = page.getByLabel(copy.ui.timeQuestion, { exact: true });
  await time.fill('20:00');
  for (const name of ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'])
    await page.getByRole('button', { name, exact: true }).click();
  await page
    .getByRole('button', { name: copy.flow.schedulePrepare, exact: true })
    .click();
  await expect(page.getByRole('alert')).toHaveText(copy.ui.errorDays);
  expect(
    (
      await page.evaluate(
        (key) => JSON.parse(sessionStorage.getItem(key)!),
        sessionKey,
      )
    ).inputs.time,
  ).toBe('');
  await expect(page.getByTestId('plan-sentence')).toContainText(sentinel);
  await page
    .getByRole('button', { name: copy.flow.scheduleWithoutTime, exact: true })
    .click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(sent.some((value) => value.includes(sentinel))).toBe(false);
  expect(await page.title()).not.toContain(sentinel);
  expect(page.url()).not.toContain(sentinel);
});

for (const failure of ['read', 'write'] as const) {
  test(`continues in memory after storage ${failure} failure and protects locale navigation`, async ({
    page,
  }) => {
    const copy = getPlanCopy('es');
    await page.addInitScript(
      ({ key, failure }) => {
        const method = failure === 'read' ? 'getItem' : 'setItem',
          read = Storage.prototype.getItem,
          write = Storage.prototype.setItem;
        Object.defineProperty(Storage.prototype, method, {
          configurable: true,
          value: function (this: Storage, name: string, ...args: string[]) {
            if (this === window.sessionStorage && name === key)
              throw new DOMException('Denied', 'SecurityError');
            return failure === 'read'
              ? read.call(this, name)
              : write.call(this, name, args[0]);
          },
        });
      },
      { key: sessionKey, failure },
    );
    await open(page);
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await expect(page.locator('.pb-notices')).toContainText(copy.ui.memory);
    page.once('dialog', (d) => d.dismiss());
    await page.locator('header a[hreflang="en"]').click();
    await expect(
      page.getByLabel(copy.ui.goalLabel, { exact: true }),
    ).toHaveValue(copy.example.purpose);
    page.once('dialog', (d) => d.accept());
    await page.locator('header a[hreflang="en"]').click();
    await expect(
      page.getByLabel(getPlanCopy('en').ui.goalLabel, { exact: true }),
    ).toHaveValue('');
  });
}

test('explains invalid saved data and failed reset without touching appearance', async ({
  page,
}) => {
  const copy = getPlanCopy('es');
  await page.addInitScript((key) => {
    localStorage.setItem('miminiapp.appearance', 'dark');
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem(key, '{"version":99}');
      sessionStorage.setItem('seeded', 'yes');
    }
    const original = Storage.prototype.removeItem;
    Object.defineProperty(Storage.prototype, 'removeItem', {
      configurable: true,
      value: function (this: Storage, name: string) {
        if (name === key) throw new DOMException('Denied', 'SecurityError');
        return original.call(this, name);
      },
    });
  }, sessionKey);
  await open(page);
  await expect(page.locator('.pb-notices')).toContainText(copy.ui.invalid);
  await expect(page.locator('.pb-notices')).toContainText(copy.ui.deleteFailed);
  await page
    .getByRole('button', { name: copy.ui.exampleButton, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await enterPlanResult(page, copy);
  await page.getByRole('button', { name: copy.ui.reset, exact: true }).click();
  await expect(page.locator('.pb-notices')).toContainText(copy.ui.deleteFailed);
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
  ).toBe('{"version":99}');
  expect(
    await page.evaluate(() => localStorage.getItem('miminiapp.appearance')),
  ).toBe('dark');
});

test('checks accessibility at every guided view in dark mode', async ({
  page,
}) => {
  const copy = getPlanCopy('es');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await open(page);
  await page
    .getByRole('button', { name: copy.ui.exampleButton, exact: true })
    .click();
  for (let index = 0; index < 5; index++) {
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    if (index === 0)
      await page
        .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
        .click();
    if (index === 1)
      await page
        .getByRole('button', { name: copy.obstacles.time, exact: true })
        .click();
    if (index === 2)
      await page
        .getByRole('button', { name: copy.flow.nextSituation, exact: true })
        .click();
    if (index === 3) await enterPlanResult(page, copy);
  }
});

test('restores legacy v1 drafts deterministically, keeping their text and exact payload', async ({
  page,
}) => {
  const copy = getPlanCopy('es');
  await open(page);
  const base = {
    version: 1,
    example: false,
    narrative: {
      startedOn: { year: 2026, month: 1, day: 31 },
      nextMonth: { year: 2026, month: 2, day: 1 },
      isJanuary: true,
    },
    inputs: {
      ...copy.example,
      obstacle: 'time',
      otherObstacle: '',
      time: '20:00',
      days: ['MO', 'TU', 'WE', 'TH', 'FR'],
    },
  };
  for (const [step, situation, expected] of [
    ['purpose', copy.example.situation, 'purpose'],
    ['obstacle', copy.example.situation, 'obstacle'],
    ['plan', '', 'situation'],
    ['plan', 'x', 'situation'],
    ['plan', copy.example.situation, 'action'],
    ['result', copy.example.situation, 'result'],
  ]) {
    const raw = JSON.stringify({
      ...base,
      step,
      inputs: { ...base.inputs, situation },
    });
    await page.evaluate(({ key, raw }) => sessionStorage.setItem(key, raw), {
      key: sessionKey,
      raw,
    });
    await page.reload();
    await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
      'data-view',
      expected,
    );
    expect(
      await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
    ).toBe(raw);
    if (expected === 'situation')
      await expect(page.locator('#pb-situation')).toHaveValue(situation);
    if (expected === 'action')
      await expect(page.locator('#pb-action')).toHaveValue(copy.example.action);
    if (expected === 'result')
      await expect(page.getByTestId('plan-sentence')).toContainText(
        copy.example.action,
      );
  }
});

test('keeps one navigation per double-click while allowing normal keyboard advancement', async ({
  page,
}) => {
  const copy = getPlanCopy('es');
  await open(page);
  await page
    .getByRole('button', { name: copy.ui.exampleButton, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .dblclick();
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-view',
    'obstacle',
  );
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-view',
    'situation',
  );
  await page.getByRole('button', { name: copy.ui.back, exact: true }).click();
  await page.getByRole('button', { name: copy.ui.back, exact: true }).click();
  const repeat = await page.locator('#pb-purpose').evaluate((el) =>
    el.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        repeat: true,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(repeat).toBe(false);
  await page.locator('#pb-purpose').press('Enter');
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-view',
    'obstacle',
  );
});
