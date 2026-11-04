import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ page, baseURL }, use) => {
      if (!baseURL)
        throw new Error('The local preview baseURL must be configured.');
      const expectedOrigin = new URL(baseURL).origin;
      const issues: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error')
          issues.push(`Console: ${message.text()}`);
      });
      page.on('pageerror', (error) => issues.push(`Page: ${error.message}`));
      page.on('requestfailed', (request) => {
        issues.push(
          `Request: ${request.url()} (${request.failure()?.errorText})`,
        );
      });
      page.on('response', (response) => {
        if (response.status() >= 400)
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
      });
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.protocol !== 'data:' && url.origin !== expectedOrigin) {
          issues.push(`Unexpected external request: ${request.url()}`);
        }
      });

      await use();

      expect(
        issues,
        'The built fixture must load and interact using only local resources.',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
