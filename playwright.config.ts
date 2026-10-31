import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const isCI = !!process.env.CI;
const uiBaseURL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const apiBaseURL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI, // fail the build if someone commits test.only
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }], // consumed by Jenkins / CI dashboards
  ],

  use: {
    testIdAttribute: 'data-test', // Sauce Demo uses data-test instead of data-testid
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: uiBaseURL },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: uiBaseURL },
    },
  ],
});
