import { test, expect } from './helpers/fixtures';
import { readFile } from 'node:fs/promises';

const compactReference = await readFile(
  'docs/design-docs/assets/creative-playground-v2/wordmark-compact.svg',
  'utf8',
);

for (const [locale, title, otherLocale] of [
  ['es', 'Plan B', 'en'],
  ['en', 'Bad Day Plan', 'es'],
] as const) {
  test(`builds and serves the isolated ${locale} fixture with real platform chrome`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    await page
      .locator('#catalogo')
      .getByRole('link', { name: new RegExp(title) })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/apps/plan-b/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByTestId('isolated-entry')).toHaveAttribute(
      'data-fixture',
      'PB_I1_ISOLATED_FIXTURE',
    );
    await expect(page.getByTestId('validated-text')).toHaveText(
      'Caminar un poco',
    );
    await expect(page.locator('output')).toHaveText('2027-1-1');
    await page.locator(`header a[href="/${otherLocale}/apps/plan-b/"]`).click();
    await expect(page.locator('html')).toHaveAttribute('lang', otherLocale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      otherLocale === 'es' ? 'Plan B' : 'Bad Day Plan',
    );
  });
}

test('keeps two preview origins separate from the ordinary platform server', async ({
  isolatedBuilds,
  request,
  baseURL,
}) => {
  const draftURL = await isolatedBuilds.draft.startPreview();
  const publishedURL = await isolatedBuilds.published.startPreview();
  expect(draftURL).not.toBe(publishedURL);
  expect(publishedURL).toBe(baseURL);
  const platform = await request.get('http://127.0.0.1:4321/es/');
  expect(platform.status()).toBe(200);
  expect(await platform.text()).toContain('/es/apps/plan-b/');
  expect(publishedURL).not.toBe('http://127.0.0.1:4321');
  expect(await (await request.get(`${draftURL}/es/`)).text()).not.toContain(
    'Bad Day Plan',
  );
  expect(await (await request.get(`${publishedURL}/es/`)).text()).toContain(
    '/es/apps/plan-b/',
  );
});

test.describe('draft build', () => {
  test.use({
    variant: 'draft',
    expected404Paths: ['/es/apps/plan-b/', '/en/apps/plan-b/'],
  });
  for (const locale of ['es', 'en']) {
    test(`excludes the ${locale} draft from catalogue and serves a genuine 404`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator('#catalogo a[href*="/apps/"]')).toHaveCount(0);
      await expect(page.locator('article')).toHaveCount(0);
      await expect(page.locator('.empty-catalogue')).toBeVisible();
      await expect(page.locator('.brand-initial')).toHaveCount(4);
      const geometry = await page
        .locator('.empty-catalogue .brand-initial')
        .evaluate((element, reference) => {
          const shape = (node: Element) => ({
            tag: node.localName,
            attributes: ['x', 'y', 'width', 'height', 'rx', 'd'].map((name) => [
              name,
              node.getAttribute(name),
            ]),
          });
          const approved = new DOMParser().parseFromString(
            reference,
            'image/svg+xml',
          );
          return {
            actual: [...element.children].map(shape),
            expected: [...approved.querySelectorAll('.piece')].map(shape),
          };
        }, compactReference);
      expect(geometry.actual).toEqual(geometry.expected);
      await expect(page.getByRole('heading', { level: 3 })).toHaveText(
        locale === 'es'
          ? 'Un espacio para lo que viene.'
          : 'A place for what comes next.',
      );
      await expect(page.locator('#catalogo')).toContainText(
        locale === 'es'
          ? 'Aún no hay miniapps publicadas'
          : 'No miniapps are published yet',
      );
      const response = await page.goto(`/${locale}/apps/plan-b/`);
      expect(response?.status()).toBe(404);
      await expect(page.getByTestId('isolated-entry')).toHaveCount(0);
    });
  }
});
