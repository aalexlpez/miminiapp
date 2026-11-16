import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/fixtures';
import { sessionKey } from '../browser/session';
import { getPlanCopy } from '../i18n/copy';

test.use({ entryKind: 'app' });
async function open(page: import('@playwright/test').Page, locale = 'es') {
  await page.goto(`/${locale}/apps/plan-b/`);
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-ready',
    'true',
  );
}

for (const locale of ['es', 'en'] as const) {
  test(`completes the ${locale} example with focus, Back, recovery, and reset`, async ({
    page,
  }) => {
    const copy = getPlanCopy(locale);
    await open(page, locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 2 })).toBeFocused();
    await expect(
      page.getByLabel(copy.ui.goalLabel, { exact: true }),
    ).toHaveValue(copy.example.purpose);
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await expect(
      page.getByLabel(`${copy.ui.if} — ${copy.ui.situationLabel}`, {
        exact: true,
      }),
    ).toHaveValue(copy.example.situation);
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
    await expect(page.getByTestId('plan-sentence')).toHaveText(
      `${copy.ui.if} ${copy.example.situation}, ${copy.ui.then} ${copy.example.action}.`,
    );
    await page.reload();
    await expect(page.getByTestId('plan-sentence')).toBeVisible();
    await page.getByRole('button', { name: copy.ui.back, exact: true }).click();
    await expect(
      page.getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, {
        exact: true,
      }),
    ).toHaveValue(copy.example.action);
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
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
      page.getByRole('button', { name: copy.ui.start, exact: true }),
    ).toBeEnabled();
  });
}

test('retains literal ES example and the narrative date through locale/month changes', async ({
  page,
}) => {
  await page.clock.install({ time: new Date(2026, 0, 31, 12) });
  await page.addInitScript(() =>
    localStorage.setItem('miminiapp.appearance', 'dark'),
  );
  await open(page);
  await page
    .getByRole('button', { name: 'Ver un ejemplo', exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    '¿Qué quieres lograr este año?',
  );
  await page.clock.setFixedTime(new Date(2026, 1, 1, 12));
  await page.locator('header a[hreflang="en"]').click();
  await expect(page.getByLabel('Your goal', { exact: true })).toHaveValue(
    getPlanCopy('es').example.purpose,
  );
  await expect(page.getByText('Example', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    'What do you want to achieve this year?',
  );
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { level: 2 })).toContainText(
    'February',
  );
  await page
    .getByRole('button', { name: 'I ran out of time', exact: true })
    .click();
  await expect(page.getByLabel('If — Situation', { exact: true })).toHaveValue(
    getPlanCopy('es').example.situation,
  );
  await page
    .getByRole('button', {
      name: getPlanCopy('en').suggestions.action.time[0],
      exact: true,
    })
    .click();
  await expect(page.getByText('Example', { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('If — Situation', { exact: true })).toHaveValue(
    getPlanCopy('es').example.situation,
  );
  expect(
    await page.evaluate(() => localStorage.getItem('miminiapp.appearance')),
  ).toBe('dark');
});

test('validates Other, days and literal result without transmitting private text', async ({
  page,
}) => {
  const sentinel = 'PB_PRIVATE_SENTINEL';
  const sent: string[] = [];
  page.on('request', (request) =>
    sent.push(request.url() + (request.postData() ?? '')),
  );
  page.on('console', (message) => sent.push(message.text()));
  await open(page);
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.getByLabel('Tu propósito', { exact: true }).fill('ab');
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('3');
  await page.getByLabel('Tu propósito', { exact: true }).fill(sentinel);
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page.getByRole('button', { name: 'Otra cosa', exact: true }).click();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await expect(
    page.getByLabel('Otro obstáculo', { exact: true }),
  ).toBeFocused();
  await page.getByLabel('Otro obstáculo', { exact: true }).fill('Mis horarios');
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page
    .getByLabel('Si — Situación', { exact: true })
    .fill(`veo <b>${sentinel}</b>`);
  await page
    .getByLabel('entonces — Acción', { exact: true })
    .fill('leo una página');
  await page
    .getByLabel('¿A qué hora suele pasar? (opcional)', { exact: true })
    .fill('20:00');
  for (const name of ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'])
    await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('button', { name: 'Ver mi plan', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Selecciona al menos');
  await page
    .getByLabel('¿A qué hora suele pasar? (opcional)', { exact: true })
    .fill('');
  await page.getByRole('button', { name: 'Ver mi plan', exact: true }).click();
  await expect(page.getByTestId('plan-sentence')).toHaveText(
    `Si veo <b>${sentinel}</b>, entonces leo una página.`,
  );
  await expect(page.getByTestId('plan-sentence').locator('b')).toHaveCount(0);
  await page.getByRole('button', { name: 'Añadir hora', exact: true }).click();
  await expect(
    page.getByLabel('¿A qué hora suele pasar? (opcional)', { exact: true }),
  ).toBeFocused();
  expect(sent.some((value) => value.includes(sentinel))).toBe(false);
  expect(await page.title()).not.toContain(sentinel);
  expect(page.url()).not.toContain(sentinel);
});

for (const failure of ['read', 'write'] as const) {
  test(`continues in memory after storage ${failure} failure and warns before locale navigation`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, failure }) => {
        const method = failure === 'read' ? 'getItem' : 'setItem';
        const read = Storage.prototype.getItem;
        const write = Storage.prototype.setItem;
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
      .getByRole('button', { name: 'Ver un ejemplo', exact: true })
      .click();
    await expect(
      page.getByTestId('plan-b-app').getByRole('status'),
    ).toContainText('no permite guardar');
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.locator('header a[hreflang="en"]').click();
    await expect(page.getByLabel('Tu propósito', { exact: true })).toHaveValue(
      getPlanCopy('es').example.purpose,
    );
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('header a[hreflang="en"]').click();
    await expect(
      page.getByRole('button', { name: 'Start', exact: true }),
    ).toBeEnabled();
  });
}

test('explains invalid stored data and a failed reset without touching appearance', async ({
  page,
}) => {
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
  await expect(
    page.getByTestId('plan-b-app').getByRole('status'),
  ).toContainText('No se pudo recuperar');
  await expect(
    page.getByTestId('plan-b-app').getByRole('status'),
  ).toContainText('No se pudo borrar');
  await page
    .getByRole('button', { name: 'Ver un ejemplo', exact: true })
    .click();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page
    .getByRole('button', { name: 'No tuve tiempo', exact: true })
    .click();
  await page.getByRole('button', { name: 'Ver mi plan', exact: true }).click();
  await page
    .getByRole('button', { name: 'Empezar otra vez', exact: true })
    .click();
  await expect(
    page.getByTestId('plan-b-app').getByRole('status'),
  ).toContainText('No se pudo borrar');
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), sessionKey),
  ).toBe('{"version":99}');
  expect(
    await page.evaluate(() => localStorage.getItem('miminiapp.appearance')),
  ).toBe('dark');
});

test('has no detected accessibility violations across the actual journey in dark mode', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await open(page);
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
        .getByRole('button', { name: 'Ver un ejemplo', exact: true })
        .click();
    if (index === 1)
      await page
        .getByRole('button', { name: 'Siguiente', exact: true })
        .click();
    if (index === 2)
      await page
        .getByRole('button', { name: 'No tuve tiempo', exact: true })
        .click();
    if (index === 3)
      await page
        .getByRole('button', { name: 'Ver mi plan', exact: true })
        .click();
  }
});
