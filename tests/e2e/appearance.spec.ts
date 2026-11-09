import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const key = 'miminiapp.appearance';
const option = (mode: string) => `[data-appearance-option="${mode}"]`;

test('system is default without writes, follows media, and explicit choice survives locale navigation', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute(
    'data-appearance',
    'system',
  );
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator(option('dark')).click();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator(option('dark'))).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.locator('header a[hreflang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({
    [key]: 'dark',
  });
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(await context.cookies()).toEqual([]);
  await page.locator(option('system')).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    'system',
  );
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

for (const failure of ['read', 'write']) {
  test(`keeps current page operational with blocked storage ${failure}`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, failure }) => {
        if (failure === 'read')
          Object.defineProperty(window, 'localStorage', {
            get() {
              throw new DOMException('Blocked', 'SecurityError');
            },
          });
        else
          Storage.prototype.setItem = function () {
            throw new DOMException('Full', 'QuotaExceededError');
          };
        Object.defineProperty(window, 'testAppearanceKey', { value: key });
      },
      { key, failure },
    );
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/es/');
    await page.locator(option('light')).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.evaluate(() =>
      dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })),
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator(option('system')).click();
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
}

test('ignores invalid data and syncs choices and deletion between tabs', async ({
  page,
  context,
}) => {
  await page.addInitScript((k) => {
    if (!localStorage.getItem(k))
      localStorage.setItem(k, '<script>bad</script>');
  }, key);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute(
    'data-appearance',
    'system',
  );
  const other = await context.newPage();
  await other.goto('/en/');
  await other.locator(option('light')).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await other.evaluate((k) => localStorage.removeItem(k), key);
  await expect(page.locator('html')).toHaveAttribute(
    'data-appearance',
    'system',
  );
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await other.close();
});

for (const locale of ['es', 'en'])
  for (const theme of ['light', 'dark']) {
    test(`${locale}/${theme}: icon controls, keyboard, reflow, contrast and original hero tile`, async ({
      page,
    }) => {
      await page.emulateMedia({
        colorScheme: theme as 'light' | 'dark',
        reducedMotion: 'reduce',
      });
      await page.goto(`/${locale}/`);
      const group = page.getByRole('group', {
        name: locale === 'es' ? 'Apariencia' : 'Appearance',
      });
      await expect(group).toBeVisible();
      await expect(group.locator('button')).toHaveCount(3);
      await expect(group.locator('select')).toHaveCount(0);
      const names =
        locale === 'es'
          ? ['Claro', 'Oscuro', 'Sistema']
          : ['Light', 'Dark', 'System'];
      for (let i = 0; i < 3; i++) {
        const button = group.getByRole('button', {
          name: names[i],
          exact: true,
        });
        await button.focus();
        await page.keyboard.press(i === 1 ? 'Space' : 'Enter');
        await expect(button).toBeFocused();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(group.locator('[aria-pressed="true"]')).toHaveCount(1);
        const size = await button.boundingBox();
        expect(size!.width).toBeGreaterThanOrEqual(48);
        expect(size!.height).toBeGreaterThanOrEqual(48);
        expect(
          await button.evaluate(
            (b) => b.querySelector('svg')!.getAnimations().length,
          ),
        ).toBe(0);
      }
      for (const width of [320, 393, 768, 1024, 1280, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      const tile = await page
        .locator('[data-ambient="tile"]')
        .evaluate((node) => {
          const tile = node.querySelector('rect')!;
          return [
            getComputedStyle(tile).fill,
            getComputedStyle(tile).stroke,
            getComputedStyle(node.querySelector('.brand-initial')!).fill,
          ];
        });
      expect(tile).toEqual([
        'rgb(247, 245, 240)',
        'rgb(36, 33, 54)',
        'rgb(121, 80, 242)',
      ]);
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(scan.violations).toEqual([]);
    });
  }

test('rotates only on interaction, honors reduced motion and preserves CP-01 loops and manual pause', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/es/');
  await expect(page.locator('.hero-art')).toHaveAttribute(
    'data-motion-entered',
    'true',
  );
  await page.locator('[data-motion-control]').click();
  await page.evaluate(() => {
    const hero = document.querySelector('.hero-art')!;
    const state = {
      hero,
      animations: hero.getAnimations({ subtree: true }),
      times: hero.getAnimations({ subtree: true }).map((a) => a.currentTime),
      bounds: document
        .querySelector('.home-hero')!
        .getBoundingClientRect()
        .toJSON(),
      shifts: [] as number[],
    };
    Object.defineProperty(window, 'appearanceTest', { value: state });
    new PerformanceObserver((list) =>
      state.shifts.push(
        ...list
          .getEntries()
          .map((e) => (e as PerformanceEntry & { value: number }).value),
      ),
    ).observe({ type: 'layout-shift' });
  });
  // Execute click and inspect in the same task, before the short microinteraction ends.
  const iconMotion = await page
    .locator(option('dark'))
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      return button
        .querySelector('svg')!
        .getAnimations()
        .map((a) => a.effect!.getTiming().duration);
    });
  expect(iconMotion).toEqual([240]);
  await page.waitForTimeout(300);
  const preserved = await page.evaluate(() => {
    const state = (
      window as unknown as {
        appearanceTest: {
          hero: Element;
          animations: Animation[];
          times: (CSSNumberish | null)[];
          bounds: object;
          shifts: number[];
        };
      }
    ).appearanceTest;
    return {
      node: state.hero === document.querySelector('.hero-art'),
      animations: state.animations.every(
        (a, i) =>
          state.hero.getAnimations({ subtree: true }).includes(a) &&
          a.currentTime === state.times[i],
      ),
      bounds: state.bounds,
      current: document
        .querySelector('.home-hero')!
        .getBoundingClientRect()
        .toJSON(),
      shifts: state.shifts,
    };
  });
  expect(preserved.node).toBe(true);
  expect(preserved.animations).toBe(true);
  expect(preserved.current).toEqual(preserved.bounds);
  expect(preserved.shifts.reduce((a, b) => a + b, 0)).toBe(0);
  await expect(page.locator('html')).toHaveAttribute(
    'data-motion-paused',
    'true',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator(option('light')).click();
  expect(
    await page
      .locator(option('light'))
      .evaluate((b) => b.querySelector('svg')!.getAnimations().length),
  ).toBe(0);
  await expect(page.locator('[data-motion-control]')).toBeDisabled();
});

test('keeps the same assembly objects when appearance changes during entry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const mark = document.querySelector('header [data-motion-seen="true"]');
      const button = document.querySelector<HTMLButtonElement>(
        '[data-appearance-option="dark"]',
      );
      if (!mark || !button || button.disabled) return;
      const animations = mark.getAnimations({ subtree: true });
      if (animations.length !== 4) return;
      animations.forEach((a) => a.pause());
      const times = animations.map((a) => a.currentTime);
      button.click();
      Object.defineProperty(window, 'appearanceAssemblyPreserved', {
        value: animations.every(
          (a, i) =>
            mark.getAnimations({ subtree: true }).includes(a) &&
            a.currentTime === times[i],
        ),
      });
      observer.disconnect();
    });
    observer.observe(document, { subtree: true, attributes: true });
  });
  await page.goto('/es/');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { appearanceAssemblyPreserved: boolean })
            .appearanceAssemblyPreserved,
      ),
    )
    .toBe(true);
});

test('CSS without JavaScript follows the system and hides nonoperational appearance controls', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}es/`);
  await expect(page.locator('.appearance-control')).toBeHidden();
  await expect(page.locator('html')).toHaveCSS(
    'background-color',
    'rgb(23, 20, 33)',
  );
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveCSS(
    'background-color',
    'rgb(247, 245, 240)',
  );
  await expect(page.locator('.brand-wordmark').first()).toBeVisible();
  await context.close();
});

test('resolves at head before body content, including stored override of the opposite system', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript((k) => {
    localStorage.setItem(k, 'dark');
    const samples: { theme: string | undefined; background: string }[] = [];
    Object.defineProperty(window, 'appearancePaintSamples', { value: samples });
    new MutationObserver(() => {
      if (document.body && document.querySelector('h1'))
        samples.push({
          theme: document.documentElement.dataset.theme,
          background: getComputedStyle(document.documentElement)
            .backgroundColor,
        });
    }).observe(document, { childList: true, subtree: true });
  }, key);
  await page.goto('/es/');
  const samples = await page.evaluate(
    () =>
      (
        window as unknown as {
          appearancePaintSamples: { theme: string; background: string }[];
        }
      ).appearancePaintSamples,
  );
  expect(samples.length).toBeGreaterThan(0);
  expect(samples.every((s) => s.theme === 'dark')).toBe(true);
  await expect(page.locator('html')).toHaveCSS(
    'background-color',
    'rgb(23, 20, 33)',
  );
});

test.describe('the shared 404 shell', () => {
  test.use({ expected404Paths: ['/es/unknown/'] });
  test('retains appearance and bilingual recovery', async ({ page }) => {
    await page.goto('/es/');
    await page.locator(option('dark')).click();
    await page.goto('/es/unknown/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.appearance-control')).toBeVisible();
    await expect(page.locator('main a[href="/en/"]')).toBeVisible();
  });
});
