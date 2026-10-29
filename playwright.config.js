// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8000',
    viewport: { width: 1080, height: 1920 },
    // Partir siempre en tema oscuro: la página sigue la preferencia del sistema.
    colorScheme: 'dark',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
