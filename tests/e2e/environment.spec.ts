import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Comprobación de entorno' }),
  ).toBeVisible();
  await expect(page.getByTestId('environment-fixture')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
});

test('hydrates the built React island and confirms a normalized label', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: 'Etiqueta de prueba' });
  await expect(page).toHaveTitle('Comprobación de entorno · MiMiniApp');

  await input.fill('  Entorno   comprobado  ');
  await page.getByRole('button', { name: 'Comprobar' }).click();

  await expect(page.getByRole('status')).toHaveText(
    'Etiqueta confirmada: Entorno comprobado',
  );
  await expect(input).toHaveValue('Entorno comprobado');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('supports keyboard validation, visible focus and reset', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: 'Etiqueta de prueba' });
  const submit = page.getByRole('button', { name: 'Comprobar' });
  const reset = page.getByRole('button', { name: 'Restablecer' });

  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  const inputFocus = await input.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  expect(inputFocus).not.toBe('none');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('alert')).toHaveText('Escribe una etiqueta.');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription(/Escribe una etiqueta\./);
  await expect(input).toBeFocused();

  await page.keyboard.type('ab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toHaveText(
    'Usa al menos 3 caracteres.',
  );

  await input.fill('');
  await page.keyboard.type('  Teclado   listo  ');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText(
    'Etiqueta confirmada: Teclado listo',
  );
  await expect(input).toHaveAttribute('aria-invalid', 'false');

  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  const buttonFocus = await submit.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      style: style.outlineStyle,
      width: Number.parseFloat(style.outlineWidth),
    };
  });
  expect(buttonFocus.style).toBe('solid');
  expect(buttonFocus.width).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Tab');
  await expect(reset).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('status')).toBeEmpty();
});

test('applies compiled responsive styles without horizontal overflow', async ({
  page,
}, testInfo) => {
  const grid = await page.getByTestId('fixture-layout').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      display: style.display,
      columns: style.gridTemplateColumns.split(' ').length,
      gap: Number.parseFloat(style.columnGap),
    };
  });
  expect(grid.display).toBe('grid');
  expect(grid.columns).toBe(
    testInfo.project.name === 'chromium-mobile' ? 1 : 2,
  );
  expect(grid.gap).toBeGreaterThan(0);

  const buttonStyle = await page
    .getByRole('button', { name: 'Comprobar' })
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        minHeight: Number.parseFloat(style.minHeight),
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        background: style.backgroundColor,
        color: style.color,
      };
    });
  expect(buttonStyle.minHeight).toBeGreaterThanOrEqual(48);
  expect(buttonStyle.borderRadius).toBeGreaterThan(0);
  expect(buttonStyle.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(buttonStyle.background).not.toBe(buttonStyle.color);

  const dimensions = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
});
