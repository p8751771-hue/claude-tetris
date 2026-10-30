const fs = require('fs');
const path = require('path');
const { test } = require('@playwright/test');

// Toda la ejecución comparte una sola carpeta: tests/evidencia/issue-N/AAAA-MM-DD_HH-MM-SS/
// playwright.config.js fija EVIDENCIA_STAMP una vez, antes de lanzar los workers.
const ISSUE = process.env.ISSUE || 'sin-issue';
const EVIDENCIA = path.join(__dirname, '..', 'evidencia', `issue-${ISSUE}`, process.env.EVIDENCIA_STAMP);

// Se corren todas las pruebas (regresión), pero solo se guardan capturas
// de las del issue en curso: tests/issue-N.spec.js.
async function capturar(page, nombre) {
  if (path.basename(test.info().file) !== `issue-${ISSUE}.spec.js`) return;
  fs.mkdirSync(EVIDENCIA, { recursive: true });
  await page.screenshot({ path: path.join(EVIDENCIA, `${nombre}.png`), fullPage: true });
}

module.exports = { capturar };
