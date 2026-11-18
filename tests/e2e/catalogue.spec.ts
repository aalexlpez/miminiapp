import { expect, test } from './fixtures';
import { miniappRegistry } from '../../src/miniapps/registry';
import { getPublishedMetadata } from '../../src/lib/miniapp-registry';
import { miniappPath } from '../../src/lib/locales';

const published = getPublishedMetadata(miniappRegistry);

const homes = [
  {
    locale: 'es',
    otherLocale: 'en',
    heading: 'Ideas que se vuelven herramientas.',
    catalogue: 'El catálogo',
    cta: 'Ver el catálogo',
  },
  {
    locale: 'en',
    otherLocale: 'es',
    heading: 'Ideas become little tools.',
    catalogue: 'The catalogue',
    cta: 'Explore the catalogue',
  },
] as const;

for (const home of homes) {
  test(`shows compact apps and dismissible descriptions in ${home.locale}`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(`/${home.locale}/`);
    const card = page.locator('.catalogue-card').first();
    const link = card.locator('a');
    const hint = card.getByRole('tooltip', { includeHidden: true });
    const information = card.getByRole('button');
    const logo = card.locator('.app-icon img');
    await expect(logo).toHaveAttribute('src', published[0].icon!);
    await expect(logo).toBeVisible();
    expect(
      await logo.evaluate(
        (img: HTMLImageElement) =>
          img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
      ),
    ).toBe(true);
    await expect(card.locator('.app-icon-placeholder')).toHaveCount(0);
    await card.scrollIntoViewIfNeeded();
    await expect(hint).toBeHidden();
    const bounds = await card.boundingBox();
    expect(bounds?.width).toBeLessThanOrEqual(128);
    expect(bounds?.height).toBeLessThanOrEqual(168);
    await expect(link).toHaveAccessibleName(
      published[0].copy[home.locale].title,
    );

    if (isMobile) {
      await information.tap();
    } else {
      await link.hover();
    }
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText(published[0].copy[home.locale].description);
    if (!isMobile) {
      await hint.hover();
      // Remain readable while the pointer travels from the tile to its hint.
      await expect(hint).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(hint).toBeHidden();

    // A keyboard focus event opens the same explanation without navigating.
    await page.getByRole('heading', { level: 2 }).click();
    await page.keyboard.press('Tab');
    await link.focus();
    await expect(link).toBeFocused();
    await expect(hint).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(hint).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      new RegExp(`${miniappPath(home.locale, published[0].slug)}$`),
    );
  });

  test(`opens the truthful ${home.locale} home and navigates the published catalogue`, async ({
    page,
  }) => {
    const response = await page.goto(`/${home.locale}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', home.locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      home.heading,
    );
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      home.catalogue,
    );
    await expect(page.locator('.empty-catalogue')).toHaveCount(0);
    for (const app of published) {
      const card = page.locator('article').filter({
        has: page.getByRole('heading', {
          name: app.copy[home.locale].title,
          exact: true,
        }),
      });
      await expect(card).toContainText(app.copy[home.locale].description);
      await expect(
        card.locator(`a[href="${miniappPath(home.locale, app.slug)}"]`),
      ).toBeVisible();
    }
    await expect(page).toHaveTitle(/MiMiniApp/);
    expect(
      await page.locator('meta[name="description"]').getAttribute('content'),
    ).toBeTruthy();
    await expect(page.locator('a[href*="/apps/"]')).toHaveCount(
      published.length,
    );
    await expect(page.locator('article')).toHaveCount(published.length);
    await expect(page.locator('astro-island')).toHaveCount(0);

    await page.getByRole('link', { name: home.cta, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${home.locale}/#catalogo$`));
    await expect(page.locator('#catalogo')).toBeInViewport();

    const language = page.locator(`header a[hreflang="${home.otherLocale}"]`);
    await language.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${home.otherLocale}/$`));
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      home.otherLocale,
    );
  });

  test(`supports complete keyboard navigation and visible focus in ${home.locale}`, async ({
    page,
  }) => {
    await page.goto(`/${home.locale}/`);
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#contenido"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();

    // Traverse the DOM's actual focus order, including visible mobile navigation.
    await page.goto(`/${home.locale}/`);
    const links = page.locator('a:visible, button:visible:not(:disabled)');
    for (let index = 0; index < (await links.count()); index += 1) {
      await page.keyboard.press('Tab');
      const link = links.nth(index);
      await expect(link).toBeFocused();
      await expect(link).toBeVisible();
      const focus = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          height: rect.height,
          width: rect.width,
          left: rect.left,
          right: rect.right,
          viewport: document.documentElement.clientWidth,
        };
      });
      expect(focus.outlineStyle).toBe('solid');
      expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
      expect(focus.height).toBeGreaterThanOrEqual(48);
      expect(focus.width).toBeGreaterThanOrEqual(48);
      expect(focus.left).toBeGreaterThanOrEqual(0);
      expect(focus.right).toBeLessThanOrEqual(focus.viewport);
    }
  });

  test(`reflows the ${home.locale} design across mobile, tablet and desktop widths`, async ({
    page,
  }) => {
    for (const width of [320, 393, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${home.locale}/`);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(
        dimensions.scroll,
        `${width}px: horizontal overflow`,
      ).toBeLessThanOrEqual(dimensions.viewport);
      for (const selector of ['header', 'main', '#catalogo', 'footer']) {
        const region = page.locator(selector);
        await expect(region).toBeVisible();
        const bounds = await region.boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
          width,
        );
      }
      const navLinks = page.locator('header nav a');
      for (const link of await navLinks.all()) {
        await expect(link).toBeVisible();
        const bounds = await link.boundingBox();
        expect(bounds?.height).toBeGreaterThanOrEqual(48);
      }
    }

    // A 1280px desktop zoomed to 400% has a 320 CSS px layout viewport.
    // The 320px pass above checks reflow, while the capture report records the
    // complementary visual zoom review rather than pretending deviceScaleFactor
    // changes browser zoom.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('link', { name: home.cta, exact: true }).click();
    await expect(page.locator('#catalogo')).toBeInViewport();
  });

  test(`loads local typefaces and leaves no stored user state in ${home.locale}`, async ({
    page,
    context,
  }) => {
    await page.goto(`/${home.locale}/`);
    await page.evaluate(() => document.fonts.ready);
    const resources = await page.evaluate(() => ({
      headingFont: getComputedStyle(document.querySelector('h1')!).fontFamily,
      bodyFont: getComputedStyle(document.body).fontFamily,
      loadedFonts: [...document.fonts].map((face) => ({
        family: face.family,
        status: face.status,
      })),
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
    }));
    expect(resources.headingFont).toMatch(/Space Grotesk/);
    expect(resources.bodyFont).toMatch(/DM Sans/);
    expect(
      resources.loadedFonts.filter((face) => face.status === 'loaded').length,
    ).toBeGreaterThanOrEqual(2);
    expect(resources.localStorage).toBe(0);
    expect(resources.sessionStorage).toBe(0);
    expect(await context.cookies()).toEqual([]);
    await expect(page.locator('script[src]')).toHaveCount(0);
  });
}

test.describe('static default entry', () => {
  test.use({ locale: 'en-US' });

  test('serves a 200 HTML redirect and a usable link to Spanish without language detection', async ({
    page,
    request,
  }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(/http-equiv=["']refresh["']/i);
    expect(html).toMatch(/content=["']0;\s*url=\/es\/["']/i);
    expect(html).toMatch(/href=["']\/es\/["']/);
    expect(html).not.toMatch(/<script\b/i);

    await page.goto('/');
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

const missingPaths = [
  '/fr/',
  '/es/no-existe/',
  '/en/apps/no-such-tool/',
  '/es/apps/i02-fixture-draft/',
];

test.describe('real static 404 recovery', () => {
  test.use({ expected404Paths: missingPaths });

  test('returns 404 for unknown locales, pages and unpublished tools with bilingual recovery', async ({
    page,
  }) => {
    for (const path of missingPaths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('[lang="es"]')).not.toHaveCount(0);
      await expect(page.locator('[lang="en"]')).not.toHaveCount(0);
      await expect(page.locator('main a[href="/es/"]')).toBeVisible();
      await expect(page.locator('main a[href="/en/"]')).toBeVisible();
      await expect(page.locator('astro-island')).toHaveCount(0);
    }

    await page.locator('main a[href="/en/"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
