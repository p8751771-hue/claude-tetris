const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Cada ejecución guarda su evidencia en tests/evidencia/issue-N/AAAA-MM-DD_HH-MM-SS/
// Uso: ISSUE=3 npm test
const ISSUE = process.env.ISSUE || 'sin-issue';
const ahora = new Date();
const pad = (n) => String(n).padStart(2, '0');
const STAMP = `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}_${pad(ahora.getHours())}-${pad(ahora.getMinutes())}-${pad(ahora.getSeconds())}`;
const EVIDENCIA = path.join(__dirname, 'evidencia', `issue-${ISSUE}`, STAMP);

async function capturar(page, nombre) {
  fs.mkdirSync(EVIDENCIA, { recursive: true });
  await page.screenshot({ path: path.join(EVIDENCIA, `${nombre}.png`), fullPage: true });
}

test('carga el tablero y el botón de tema', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#board')).toBeVisible();
  await expect(page.locator('#theme-toggle')).toBeVisible();
  await capturar(page, 'carga-tablero');
});

test('el modo claro cambia el tema y se captura', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await capturar(page, 'modo-claro');
});

test('el modo oscuro vuelve al tema original', async ({ page }) => {
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await capturar(page, 'modo-oscuro');
});
