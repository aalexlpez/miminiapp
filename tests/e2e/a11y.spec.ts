import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('has no detected WCAG 2.2 AA violations in initial, error and success states', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByTestId('environment-fixture')).toHaveAttribute(
    'data-hydrated',
    'true',
  );

  async function checkAccessibility(state: string) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      `Accessibility violations in ${state} state`,
    ).toEqual([]);
  }

  await checkAccessibility('initial');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Escribe una etiqueta.');
  await checkAccessibility('error');

  await page
    .getByRole('textbox', { name: 'Etiqueta de prueba' })
    .fill('Base accesible');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Etiqueta confirmada: Base accesible',
  );
  await checkAccessibility('success');
});
