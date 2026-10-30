const { test, expect } = require('@playwright/test');
const { capturar, guardarVideo } = require('./helpers/evidencia');
const { siguienteTecla } = require('./helpers/bot-tetris');

// Requerimiento: una prueba juega Tetris sola desde el inicio y llega al nivel 4
// (30 líneas) sin GAME OVER, con video de la partida como evidencia (issue #26).
// Juega solo con el teclado; page.evaluate únicamente lee el estado para elegir cada tecla.
// La evidencia se guarda en tests/evidencia/issue-N/AAAA-MM-DD_HH-MM-SS/
// Uso: ISSUE=26 npm test

// Graba el video de la página; se guarda como partida-nivel-4.webm.
test.use({ video: 'on' });

const LINEAS_NIVEL_4 = 30;
const valor = (page, id) => page.locator(`#${id}`);

test('juega sola desde el inicio hasta el nivel 4 sin GAME OVER', async ({ page }) => {
  // La partida completa dura más de 30 segundos.
  test.setTimeout(10 * 60 * 1000);

  await page.goto('/');
  await expect(valor(page, 'level')).toHaveText('1');
  await expect(valor(page, 'lines')).toHaveText('0');
  await capturar(page, 'inicio-partida.png');

  let atascado = 0;
  let anterior = '';
  for (;;) {
    const estado = await page.evaluate(() => ({
      tablero: board.map(f => [...f]),
      forma: current.shape.map(f => [...f]),
      x: current.x,
      y: current.y,
      piezas: pieces,
      lineas: lines,
      gameOver,
    }));
    expect(estado.gameOver, 'GAME OVER antes de llegar al nivel 4').toBe(false);
    if (estado.lineas >= LINEAS_NIVEL_4) break;

    // Si la tecla anterior no cambió la pieza, cuenta como atasco (ver siguienteTecla).
    const clave = `${estado.piezas}|${estado.forma.join()}|${estado.x}|${estado.y}`;
    atascado = clave === anterior ? atascado + 1 : 0;
    anterior = clave;

    await page.keyboard.press(siguienteTecla({ tablero: estado.tablero, forma: estado.forma, x: estado.x, atascado }));
  }

  await expect(valor(page, 'level')).toHaveText('4');
  expect(Number(await valor(page, 'lines').textContent())).toBeGreaterThanOrEqual(LINEAS_NIVEL_4);
  await expect(page.locator('#overlay')).toBeHidden();
  await capturar(page, 'nivel-4-sin-game-over.png');

  // Cerrar la página antes de guardar el video: Playwright lo termina de escribir al cerrarla.
  await page.close();
  await guardarVideo(page, 'partida-nivel-4.webm');
});
