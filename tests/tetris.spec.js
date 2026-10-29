const { test, expect } = require('@playwright/test');
const path = require('path');

const EVIDENCIA = path.join(__dirname, '..', 'evidencia', 'qa');

test('carga el tablero y el botón de tema', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#board')).toBeVisible();
  await expect(page.locator('#theme-toggle')).toBeVisible();
});

test('el modo claro cambia el tema y se captura', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.screenshot({ path: path.join(EVIDENCIA, 'modo-claro.png'), fullPage: true });
});

test('el modo oscuro vuelve al tema original', async ({ page }) => {
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
