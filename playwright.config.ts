import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', timeout: 30_000, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4350', viewport: { width: 1440, height: 1000 }, launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] }, trace: 'retain-on-failure' },
  reporter: [['list'], ['json', { outputFile: 'artifacts/test-results.json' }]],
  webServer: { command: 'npm run preview -- --ignore-lock --port 4350', url: 'http://127.0.0.1:4350', reuseExistingServer: !process.env.CI, timeout: 30_000 },
});
