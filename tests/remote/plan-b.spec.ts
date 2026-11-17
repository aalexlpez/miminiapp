import { expect, test } from '../e2e/fixtures';
import { expectedReleaseIdentity } from './target';
import { verifyPlanJourney } from '../../src/miniapps/plan-b/tests/helpers/journey';

for (const locale of ['es', 'en'] as const) {
  test(`serves the trusted release's ${locale} Plan B journey, recovery and scoped reset`, async ({
    page,
    request,
  }) => {
    const identity = await request.get('/release-manifest.json', {
      maxRedirects: 0,
    });
    expect(identity.status()).toBe(200);
    expect(await identity.json()).toEqual(expectedReleaseIdentity());
    await verifyPlanJourney(page, locale);
  });
}
