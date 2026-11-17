import { test } from './fixtures';
import { verifyPlanJourney } from '../../src/miniapps/plan-b/tests/helpers/journey';

for (const locale of ['es', 'en'] as const) {
  test(`serves the real registered ${locale} Plan B journey, recovery and scoped reset`, async ({
    page,
  }) => {
    await verifyPlanJourney(page, locale);
  });
}
