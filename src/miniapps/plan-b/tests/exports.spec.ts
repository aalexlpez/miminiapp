import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/fixtures';
import { getPlanCopy } from '../i18n/copy';

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
  await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.ui.viewPlan, exact: true })
    .click();
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
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
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
  await page
    .getByRole('button', { name: copy.exports.saveImage, exact: true })
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
  await expect(page.getByTestId('plan-sentence')).toContainText(
    copy.example.action,
  );
});

test('recovers from PNG encoding failure and releases all URLs over ten export/reset cycles', async ({
  page,
}) => {
  await page.addInitScript(() => {
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
  await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
  await page
    .getByRole('button', { name: copy.obstacles.time, exact: true })
    .click();
  await page
    .getByRole('button', { name: copy.ui.viewPlan, exact: true })
    .click();
  await expect(
    page.getByText(copy.exports.imagePrepareError, { exact: true }),
  ).toBeVisible();
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
    if (index === 9) break;
    await page
      .getByRole('button', { name: copy.ui.exampleButton, exact: true })
      .click();
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
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
    await page.getByRole('button', { name: copy.ui.next, exact: true }).click();
    await page
      .getByRole('button', { name: copy.obstacles.time, exact: true })
      .click();
    const situation = '界'.repeat(90);
    const action = 'W'.repeat(90);
    await page
      .getByLabel(`${copy.ui.if} — ${copy.ui.situationLabel}`, { exact: true })
      .fill(situation);
    await page
      .getByLabel(`${copy.ui.then} — ${copy.ui.actionLabel}`, { exact: true })
      .fill(action);
    await page
      .getByRole('button', { name: copy.ui.viewPlan, exact: true })
      .click();
    await expect(
      page.getByRole('img', { name: copy.exports.imageReady }),
    ).toBeVisible();
    const drawn: {
      text: string;
      font: string;
      y: number;
      width: number;
      color: string;
    }[] = await page.evaluate(() => Reflect.get(window, '__pbDrawn'));
    expect(
      drawn
        .slice(1)
        .map((line) => line.text)
        .join(''),
    ).toBe(`Si ${situation}, entonces ${action}.`);
    for (const line of drawn.slice(1)) {
      expect(
        Number.parseFloat(line.font.match(/([\d.]+)px/)![1]),
      ).toBeGreaterThanOrEqual(47.16);
      expect(line.y).toBeGreaterThanOrEqual(817.92);
      expect(line.y).toBeLessThan(1840.32);
      expect(line.width).toBeLessThanOrEqual(943.2);
    }
    expect(drawn[1].color).toBe(theme === 'dark' ? '#f7f3ff' : '#242136');
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
