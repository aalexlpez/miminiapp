import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './helpers/fixtures';
import { getPlanCopy } from '../i18n/copy';
import { enterPlanResult } from './helpers/journey';

test.use({ entryKind: 'app' });
async function openPlan(page: Page, locale: 'es' | 'en') {
  const copy = getPlanCopy(locale);
  await page.goto(`/${locale}/apps/plan-b/`);
  await page
    .getByRole('button', { name: copy.ui.exampleButton, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
    .click();
  return copy;
}
function luminance(color: number[], gray: number) {
  const neutral = color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
  return color
    .map((value) => (value * (1 - gray) + neutral * gray) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}
async function contrast(page: Page, gray: number) {
  const samples = await page
    .locator(
      '.pb-app button:visible, .pb-app input:visible, .pb-app textarea:visible, .pb-app label:visible, .pb-app h2:visible, .pb-app .pb-hint:visible',
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        let parent: Element | null = element;
        let background = 'rgba(0, 0, 0, 0)';
        while (parent && background === 'rgba(0, 0, 0, 0)') {
          background = getComputedStyle(parent).backgroundColor;
          parent = parent.parentElement;
        }
        const rgb = (value: string) =>
          value
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number);
        return {
          text: element.textContent?.slice(0, 30),
          foreground: rgb(getComputedStyle(element).color),
          background: rgb(background),
        };
      }),
    );
  for (const sample of samples) {
    const values = [
      luminance(sample.foreground, gray),
      luminance(sample.background, gray),
    ].sort((a, b) => a - b);
    expect(
      (values[1] + 0.05) / (values[0] + 0.05),
      JSON.stringify(sample),
    ).toBeGreaterThanOrEqual(4.5);
  }
}

for (const locale of ['es', 'en'] as const)
  for (const theme of ['light', 'dark'] as const) {
    test(`${locale}/${theme}: keeps every guided view readable with reduced motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      const copy = await openPlan(page, locale);
      const app = page.getByTestId('plan-b-app');
      await expect(app).toHaveCSS('filter', 'none');
      await expect(page.locator('.site-header')).toHaveCSS('filter', 'none');
      for (let phase = 0; phase < 4; phase++) {
        await contrast(page, 0);
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
              .analyze()
          ).violations,
        ).toEqual([]);
        await expect(page.locator('.pb-screen')).toHaveCSS(
          'animation-name',
          'none',
        );
        if (phase === 0) {
          await page
            .getByRole('button', { name: copy.obstacles.time, exact: true })
            .click();
          await page
            .getByRole('button', { name: copy.flow.nextOther, exact: true })
            .click();
        }
        if (phase === 1)
          await page
            .getByRole('button', { name: copy.flow.nextSituation, exact: true })
            .click();
        if (phase === 2) await enterPlanResult(page, copy);
      }
    });
  }

test('finite view motion remains interruptible and never delays a valid submission', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 320, height: 851 });
  const copy = await openPlan(page, 'en');
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.flow.nextOther, exact: true })
    .click();
  const motion = await page.locator('.pb-screen').evaluate((el) => {
    const animation = el
      .getAnimations()
      .find(
        (value) =>
          value instanceof CSSAnimation &&
          value.animationName === 'pb-screen-enter',
      )!;
    animation.pause();
    return [0, 180].map((time) => {
      animation.currentTime = time;
      return {
        opacity: Number(getComputedStyle(el).opacity),
        y: new DOMMatrix(getComputedStyle(el).transform).f,
      };
    });
  });
  expect(motion[0].y).toBeCloseTo(8, 1);
  expect(motion[1].y).toBeCloseTo(0, 1);
  expect(motion[0].opacity).toBeCloseTo(0.7, 1);
  expect(motion[1].opacity).toBeCloseTo(1, 1);
  await page
    .getByRole('button', { name: copy.flow.nextSituation, exact: true })
    .click();
  await page.locator('.pb-screen').evaluate((el) => {
    for (const animation of el.getAnimations()) {
      animation.pause();
      animation.currentTime = 0;
    }
  });
  await enterPlanResult(page, copy);
  await expect(page.getByTestId('plan-sentence')).toContainText(
    copy.example.action,
  );
  await expect(page.locator('#pb-step-title')).toBeFocused();
});

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: navigates the populated candidate without hydrating its UI in the catalogue`, async ({
    page,
  }) => {
    const copy = getPlanCopy(locale);
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`/${locale}/`);
    await expect(page.locator('article')).toHaveCount(1);
    await expect(page.locator('article')).toContainText(
      locale === 'es' ? 'Plan B' : 'Bad Day Plan',
    );
    await expect(page.locator('astro-island')).toHaveCount(0);
    expect(requests.filter((url) => /\.(js|mjs)(?:\?|$)/.test(url))).toEqual(
      [],
    );
    await page.locator(`a[href="/${locale}/apps/plan-b/"]`).click();
    await expect(page).toHaveTitle(locale === 'es' ? /Plan B/ : /Bad Day Plan/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    const other = locale === 'es' ? 'en' : 'es';
    await page.locator(`header a[hreflang="${other}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${other}/apps/plan-b/$`));
    await expect(
      page.getByLabel(getPlanCopy(other).ui.goalLabel, { exact: true }),
    ).toHaveValue(copy.example.purpose);
  });
}

test('reflows every screen in both languages/themes and at doubled CSS size', async ({
  page,
}) => {
  for (const locale of ['es', 'en'] as const)
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(`/${locale}/apps/plan-b/`);
      const copy = getPlanCopy(locale);
      const app = page.getByTestId('plan-b-app');
      await expect(app).toHaveAttribute('data-ready', 'true');
      await page
        .getByRole('button', { name: copy.ui.exampleButton, exact: true })
        .click();
      // This is a reflow/CSS-zoom check; native browser zoom remains a manual review.
      for (let step = 0; step < 5; step++) {
        for (const width of [320, 393, 768, 1280, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          const dimensions = await page.evaluate(() => ({
            view: innerWidth,
            scroll: document.documentElement.scrollWidth,
          }));
          expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.view);
          for (const box of await app
            .locator('button:visible, input:visible, textarea:visible')
            .evaluateAll((elements) =>
              elements.map((element) => {
                const target = element.matches('input[type="radio"]')
                  ? element.closest('label') || element
                  : element;
                const rect = target.getBoundingClientRect();
                return { width: rect.width, height: rect.height };
              }),
            )) {
            expect(box.width).toBeGreaterThanOrEqual(48);
            expect(box.height).toBeGreaterThanOrEqual(48);
          }
        }
        await page.evaluate(() => {
          document.documentElement.style.zoom = '2';
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.evaluate(() => {
          document.documentElement.style.zoom = '';
        });
        if (step === 0)
          await page
            .getByRole('button', { name: copy.flow.nextPurpose, exact: true })
            .click();
        if (step === 1) {
          await page
            .getByRole('button', { name: copy.obstacles.time, exact: true })
            .click();
          await page
            .getByRole('button', { name: copy.flow.nextOther, exact: true })
            .click();
        }
        if (step === 2)
          await page
            .getByRole('button', { name: copy.flow.nextSituation, exact: true })
            .click();
        if (step === 3) await enterPlanResult(page, copy);
      }
      await page
        .getByRole('button', { name: copy.ui.reset, exact: true })
        .click();
    }
});
