import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/fixtures';
import { getPlanCopy } from '../i18n/copy';
import { enterPlanResult, openCalendar } from './helpers/journey';

test.use({ entryKind: 'app' });
async function result(
  page: import('@playwright/test').Page,
  locale: 'es' | 'en' = 'es',
) {
  const copy = getPlanCopy(locale);
  await page.goto(`/${locale}/apps/plan-b/`);
  await expect(page.getByTestId('plan-b-app')).toHaveAttribute(
    'data-ready',
    'true',
  );
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
  await expect(
    page.getByRole('img', { name: copy.exports.imageReady }),
  ).toBeVisible();
  return copy;
}

for (const locale of ['es', 'en'] as const) {
  test(`downloads actual ${locale} calendar and PNG offline without altering the plan`, async ({
    page,
    context,
  }) => {
    await page.clock.install({ time: new Date(2026, 10, 17, 12) });
    const copy = await result(page, locale);
    const sentence = await page.getByTestId('plan-sentence').textContent();
    await context.setOffline(true);
    const firstDownload = page.waitForEvent('download');
    await page
      .getByRole('button', { name: copy.exports.calendarDownload, exact: true })
      .click();
    const first = await firstDownload;
    expect(first.suggestedFilename()).toBe(
      locale === 'es' ? 'plan-b.ics' : 'bad-day-plan.ics',
    );
    const contents = (await readFile((await first.path())!))
      .toString('utf8')
      .replace(/\r\n /g, '');
    expect(contents).toContain('DTSTART:20261118T200000\r\n');
    expect(contents).toContain('DTEND:20261118T201500\r\n');
    expect(contents).toContain(
      'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20;WKST=MO',
    );
    expect(contents).toContain(copy.example.situation);
    const anotherDownload = page.waitForEvent('download');
    await page
      .getByRole('button', { name: copy.exports.calendarDownload, exact: true })
      .click();
    const another = (
      await readFile((await (await anotherDownload).path())!)
    ).toString();
    expect(another.match(/UID:(.+)\r\n/)![1]).not.toBe(
      contents.match(/UID:(.+)\r\n/)![1],
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'canShare', {
        configurable: true,
        value: () => false,
      }),
    );
    const pngDownload = page.waitForEvent('download');
    await page
      .getByRole('button', { name: copy.exports.saveImage, exact: true })
      .click();
    const png = await pngDownload;
    expect(png.suggestedFilename()).toBe(
      locale === 'es' ? 'plan-b.png' : 'bad-day-plan.png',
    );
    const bytes = await readFile((await png.path())!);
    expect(bytes.subarray(1, 4).toString()).toBe('PNG');
    expect(bytes.readUInt32BE(16)).toBe(1179);
    expect(bytes.readUInt32BE(20)).toBe(2556);
    await page
      .getByRole('button', { name: copy.exports.google, exact: true })
      .click();
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('button', { name: copy.exports.cancel }),
    ).toBeFocused();
    await dialog.getByRole('button', { name: copy.exports.continue }).click();
    await expect(
      page.getByText(copy.exports.offline, { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId('plan-sentence')).toHaveText(sentence!);
    // A fresh example and generation also work after disconnecting, without reload.
    await page
      .getByRole('button', { name: copy.ui.reset, exact: true })
      .click();
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
    await expect(
      page.getByRole('img', { name: copy.exports.imageReady }),
    ).toBeVisible();
    await context.setOffline(false);
  });
}

test('does not send anything to Google before confirmation; severs opener and referrer on confirmation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const calls: {
      url: string;
      rel: string;
      referrer: string;
      opener: unknown;
    }[] = [];
    Reflect.set(window, '__pbGoogle', calls);
    window.open = () => {
      const doc = document.implementation.createHTMLDocument();
      const popup = { document: doc, opener: window, close() {} };
      const create = doc.createElement.bind(doc);
      doc.createElement = ((tag: string) => {
        const element = create(tag);
        if (element instanceof HTMLAnchorElement)
          element.click = () => {
            calls.push({
              url: element.href,
              rel: element.rel,
              referrer: element.referrerPolicy,
              opener: popup.opener,
            });
          };
        return element;
      }) as typeof doc.createElement;
      return popup as unknown as Window;
    };
  });
  const copy = await result(page);
  const google = page.getByRole('button', {
    name: copy.exports.google,
    exact: true,
  });
  await google.click();
  await expect(page.getByRole('dialog')).toContainText(
    copy.exports.googleWarning,
  );
  await page.keyboard.press('Escape');
  await expect(google).toBeFocused();
  expect(await page.evaluate(() => Reflect.get(window, '__pbGoogle'))).toEqual(
    [],
  );
  await google.click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: copy.exports.cancel })
    .click();
  expect(await page.evaluate(() => Reflect.get(window, '__pbGoogle'))).toEqual(
    [],
  );
  await google.click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: copy.exports.continue })
    .click();
  const calls = await page.evaluate(() => Reflect.get(window, '__pbGoogle'));
  expect(calls).toHaveLength(1);
  const url = new URL(calls[0].url);
  expect(url.origin).toBe('https://calendar.google.com');
  expect(url.searchParams.get('details')).toContain(copy.example.situation);
  expect(url.searchParams.get('recur')).toBe(
    'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20;WKST=MO',
  );
  expect(calls[0]).toMatchObject({
    opener: null,
    rel: 'noopener noreferrer',
    referrer: 'no-referrer',
  });
  await page.evaluate(() => {
    window.open = () => null;
  });
  await google.click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: copy.exports.continue })
    .click();
  await expect(
    page.getByText(copy.exports.popupError, { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('plan-sentence')).toContainText(
    copy.example.action,
  );
});

test('shares only a clean current-origin URL; handles clipboard failure and share cancellation', async ({
  page,
  baseURL,
}) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__pbShares', []);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        Reflect.get(window, '__pbShares').push(data);
        if (Reflect.get(window, '__pbCancel'))
          throw new DOMException('Cancelled', 'AbortError');
      },
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied');
        },
      },
    });
  });
  const copy = await result(page, 'en');
  await page.getByText(copy.exports.shareTitle, { exact: true }).click();
  await page
    .getByRole('button', { name: copy.exports.share, exact: true })
    .click();
  await expect(
    page.getByText(copy.exports.shared, { exact: true }),
  ).toBeVisible();
  const shares = await page.evaluate(() => Reflect.get(window, '__pbShares'));
  expect(shares).toEqual([
    { text: copy.exports.shareText, url: `${baseURL}/en/apps/plan-b/` },
  ]);
  expect(JSON.stringify(shares)).not.toContain(copy.example.purpose);
  await page.evaluate(() => Reflect.set(window, '__pbCancel', true));
  await page
    .getByRole('button', { name: copy.exports.share, exact: true })
    .click();
  await expect(
    page.getByText(copy.exports.shared, { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText(copy.exports.shareError, { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole('button', { name: copy.exports.copy, exact: true })
    .click();
  await expect(page.getByLabel(copy.exports.linkLabel)).toHaveValue(
    `${baseURL}/en/apps/plan-b/`,
  );
});

test('prepares file sharing before the user gesture and keeps download/view alternatives after failure', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__pbFiles', []);
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: () => true },
      share: {
        configurable: true,
        value: async (data: ShareData) => {
          Reflect.get(window, '__pbFiles').push({
            name: data.files?.[0].name,
            type: data.files?.[0].type,
            active: navigator.userActivation.isActive,
          });
          throw new DOMException('Denied', 'NotAllowedError');
        },
      },
    });
  });
  const copy = await result(page);
  await page.getByText(copy.exports.imageOptions, { exact: true }).click();
  await page
    .getByRole('button', { name: copy.exports.shareImage, exact: true })
    .click();
  expect(await page.evaluate(() => Reflect.get(window, '__pbFiles'))).toEqual([
    { name: 'plan-b.png', type: 'image/png', active: true },
  ]);
  await expect(
    page.getByText(copy.exports.imageError, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: copy.exports.openImage }),
  ).toHaveAttribute('href', /^blob:/);
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: copy.exports.downloadImage, exact: true })
    .click();
  expect((await download).suggestedFilename()).toBe('plan-b.png');
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbFiles').length),
  ).toBe(1);
  await expect(page.getByTestId('plan-sentence')).toContainText(
    copy.example.action,
  );
});

test('recovers from PNG encoding failure and releases all URLs over ten export/reset cycles', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const frames = new Set<number>();
    Reflect.set(window, '__pbFrames', frames);
    const request = requestAnimationFrame.bind(window),
      cancel = cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        frames.delete(id);
        callback(time);
      });
      frames.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      frames.delete(id);
      cancel(id);
    };
    const create = URL.createObjectURL.bind(URL);
    const revoke = URL.revokeObjectURL.bind(URL);
    const urls = new Set<string>();
    Reflect.set(window, '__pbUrls', urls);
    URL.createObjectURL = (blob) => {
      const url = create(blob);
      urls.add(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      urls.delete(url);
      revoke(url);
    };
    const encode = HTMLCanvasElement.prototype.toBlob;
    Reflect.set(window, '__pbEncode', encode);
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      callback(null);
    };
  });
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
  await expect(
    page.getByText(copy.exports.imagePrepareError, { exact: true }),
  ).toBeVisible();
  const idleFrames = await page.evaluate(
    () => Reflect.get(window, '__pbFrames').size as number,
  );
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = Reflect.get(window, '__pbEncode');
  });
  await page
    .getByRole('button', { name: copy.exports.retryImage, exact: true })
    .click();
  for (let index = 0; index < 10; index++) {
    await expect(
      page.getByRole('img', { name: copy.exports.imageReady }),
    ).toBeVisible();
    const downloading = page.waitForEvent('download');
    await page
      .getByRole('button', { name: copy.exports.calendarDownload, exact: true })
      .click();
    await downloading;
    expect(
      await page.evaluate(() => Reflect.get(window, '__pbUrls').size),
    ).toBe(2);
    await page
      .getByRole('button', { name: copy.ui.reset, exact: true })
      .click();
    expect(
      await page.evaluate(() => Reflect.get(window, '__pbUrls').size),
    ).toBe(0);
    await expect
      .poll(() =>
        page.evaluate(() => Reflect.get(window, '__pbFrames').size as number),
      )
      .toBeLessThanOrEqual(idleFrames);
    if (index === 9) break;
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
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`renders maximum text intact in PNG and keeps consent accessible in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript(() => {
      Reflect.set(window, '__pbDrawn', []);
      const fill = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (
        text,
        x,
        y,
        maxWidth,
      ) {
        if (this.canvas.width === 1179)
          Reflect.get(window, '__pbDrawn').push({
            text,
            font: this.font,
            x,
            align: this.textAlign,
            y,
            width: this.measureText(text).width,
            color: this.fillStyle,
          });
        return maxWidth === undefined
          ? fill.call(this, text, x, y)
          : fill.call(this, text, x, y, maxWidth);
      };
    });
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
    const situation = '界'.repeat(90);
    const action = 'W'.repeat(90);
    if (
      !(await page
        .getByLabel(`${copy.ui.if} — ${copy.ui.situationLabel}`, {
          exact: true,
        })
        .count())
    )
      await page
        .getByRole('radio', { name: /^(Escribir la mía|Write my own)$/ })
        .check();
    await page
      .getByLabel(`${copy.ui.if} — ${copy.ui.situationLabel}`, { exact: true })
      .fill(situation);
    await page
      .getByRole('button', { name: copy.flow.nextSituation, exact: true })
      .click();
    if (
      !(await page
        .getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, { exact: true })
        .count())
    )
      await page
        .getByRole('radio', { name: /^(Escribir la mía|Write my own)$/ })
        .check();
    await page
      .getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, { exact: true })
      .fill(action);
    await enterPlanResult(page, copy);
    await openCalendar(page, copy);
    await expect(
      page.getByRole('img', { name: copy.exports.imageReady }),
    ).toBeVisible();
    // The owner-supplied purple/lime mark must reach the real exported pixels,
    // alongside the label, in both themes (not just appear in the HTML UI).
    const identity = await page
      .getByRole('img', { name: copy.exports.imageReady })
      .evaluate(async (image: HTMLImageElement) => {
        const bitmap = await createImageBitmap(
          await (await fetch(image.src)).blob(),
        );
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(bitmap, 0, 0);
        const pixels = context.getImageData(100, 800, 70, 1040).data;
        let purple = 0;
        let lime = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const [r, g, b] = pixels.slice(i, i + 3);
          if (b > 150 && b > r * 1.5 && b > g * 2) purple++;
          if (r > 130 && g > 200 && b < 130) lime++;
        }
        bitmap.close();
        canvas.width = canvas.height = 0;
        return { purple, lime };
      });
    expect(identity.purple).toBeGreaterThan(200);
    expect(identity.lime).toBeGreaterThan(10);
    const drawn: {
      text: string;
      font: string;
      x: number;
      align: string;
      y: number;
      width: number;
      color: string;
    }[] = await page.evaluate(() => Reflect.get(window, '__pbDrawn'));
    const planLines = drawn
      .filter((line) => line.text !== 'MiMiniApp')
      .slice(1);
    expect(
      drawn.some((line) => line.text === 'MiMiniApp' && line.y > 1840.32),
    ).toBe(true);
    expect(planLines.map((line) => line.text).join('')).toBe(
      `Si ${situation}, entonces ${action}.`,
    );
    for (const line of planLines) {
      expect(line.x).toBeCloseTo(117.9, 1);
      expect(line.align).toBe('left');
    }
    for (const line of planLines) {
      expect(
        Number.parseFloat(line.font.match(/([\d.]+)px/)![1]),
      ).toBeGreaterThanOrEqual(47.16);
      expect(line.y).toBeGreaterThanOrEqual(817.92);
      expect(line.y).toBeLessThan(1840.32);
      expect(line.width).toBeLessThanOrEqual(943.2);
    }
    expect(planLines[0].color).toBe(theme === 'dark' ? '#f7f3ff' : '#242136');
    await page
      .getByRole('button', { name: copy.exports.google, exact: true })
      .click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
  });
}

test('recovers from an unavailable local font and regenerates the real image after a theme change', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__pbFontUnavailable', true);
    const load = document.fonts.load.bind(document.fonts);
    document.fonts.load = (...args) =>
      Reflect.get(window, '__pbFontUnavailable')
        ? Promise.resolve([])
        : load(...args);
  });
  const copy = getPlanCopy('en');
  await page.goto('/en/apps/plan-b/');
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
  await expect(
    page.getByText(copy.exports.imagePrepareError, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: copy.exports.saveImage, exact: true }),
  ).toBeDisabled();
  const sentence = await page.getByTestId('plan-sentence').textContent();
  const saved = await page.evaluate(() =>
    sessionStorage.getItem('miminiapp.plan-b.v1'),
  );
  await page.evaluate(() => Reflect.set(window, '__pbFontUnavailable', false));
  await page
    .getByRole('button', { name: copy.exports.retryImage, exact: true })
    .click();
  const image = page.getByRole('img', {
    name: copy.exports.imageReady,
    exact: true,
  });
  await expect(image).toBeVisible();
  const oldUrl = await image.getAttribute('src');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(image).toHaveAttribute('src', /^blob:/);
  await expect(image).not.toHaveAttribute('src', oldUrl!);
  const rgba = await image.evaluate(async (img: HTMLImageElement) => {
    const bitmap = await createImageBitmap(await (await fetch(img.src)).blob());
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d')!;
    context.drawImage(bitmap, 0, 0);
    const color = [...context.getImageData(0, 0, 1, 1).data];
    bitmap.close();
    canvas.width = canvas.height = 0;
    return color;
  });
  expect(rgba).toEqual([23, 20, 33, 255]);
  await expect(page.getByTestId('plan-sentence')).toHaveText(sentence!);
  expect(
    await page.evaluate(() => sessionStorage.getItem('miminiapp.plan-b.v1')),
  ).toBe(saved);
});

test('exports once per double-click or held Enter while allowing a later intentional export', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__pbExports', { png: 0, ics: 0 });
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: () => false,
    });
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      const counts = Reflect.get(window, '__pbExports');
      if (this.download.endsWith('.png')) counts.png++;
      if (this.download.endsWith('.ics')) counts.ics++;
      click.call(this);
    };
  });
  const copy = await result(page);
  const save = page.getByRole('button', {
    name: copy.exports.saveImage,
    exact: true,
  });
  const first = page.waitForEvent('download');
  await save.dblclick();
  expect((await first).suggestedFilename()).toBe('plan-b.png');
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').png),
  ).toBe(1);
  await save.focus();
  const second = page.waitForEvent('download');
  await page.keyboard.down('Enter');
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  expect((await second).suggestedFilename()).toBe('plan-b.png');
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').png),
  ).toBe(2);
  const third = page.waitForEvent('download');
  await save.click();
  await third;
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').png),
  ).toBe(3);
  const calendar = page.getByRole('button', {
    name: copy.exports.calendarDownload,
    exact: true,
  });
  const fourth = page.waitForEvent('download');
  await calendar.dblclick();
  expect((await fourth).suggestedFilename()).toBe('plan-b.ics');
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').ics),
  ).toBe(1);
  await page.getByLabel(copy.ui.timeQuestion, { exact: true }).focus();
  const fifth = page.waitForEvent('download');
  await page.keyboard.down('Enter');
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await fifth;
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').ics),
  ).toBe(2);
  const sixth = page.waitForEvent('download');
  await calendar.click();
  await sixth;
  expect(
    await page.evaluate(() => Reflect.get(window, '__pbExports').ics),
  ).toBe(3);
});
