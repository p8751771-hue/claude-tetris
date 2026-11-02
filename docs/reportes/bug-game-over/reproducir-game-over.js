// Reproduce el bug: tras un GAME OVER causado por la gravedad (dentro de loop),
// el bucle sigue corriendo. Graba video, toma capturas y marca en rojo la evidencia.
// Uso: node reproducir-game-over.js <ruta a index.html> <carpeta de salida>
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const [, , INDEX, SALIDA] = process.argv;
const VENTANA = { width: 560, height: 800 };

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VENTANA, colorScheme: 'dark',
    recordVideo: { dir: SALIDA, size: VENTANA },
  });
  const page = await context.newPage();

  // Misma semilla que tests/helpers/semilla.js: la partida es reproducible
  await page.addInitScript(() => {
    let a = 34 >>> 0;
    Math.random = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.goto('file://' + INDEX);

  // Apila piezas con caída rápida en el centro. Cuando la pieza actual aterrizaría
  // cerca del techo, deja de pulsar teclas y espera: así la gravedad (loop) fija
  // la pieza y el GAME OVER ocurre dentro de loop(), que es el caso con el bug.
  let porGravedad = false;
  for (;;) {
    const e = await page.evaluate(() => ({ gameOver, gy: ghostY(), y: current.y }));
    if (e.gameOver) break;
    if (e.gy - e.y > 3) {
      await page.keyboard.press('Space');
    } else {
      porGravedad = true;
      await page.waitForTimeout(100);
    }
  }
  const alGameOver = await page.evaluate(() => ({ animId, pieces }));
  console.log('GAME OVER por gravedad:', porGravedad, alGameOver);

  // Marcas en rojo (solo para la evidencia; no tocan la lógica del juego):
  // recuadro sobre PIEZAS y NEXT, y una etiqueta con los contadores en vivo.
  await page.evaluate((inicio) => {
    const marco = (el, texto) => {
      const r = el.getBoundingClientRect();
      const d = document.createElement('div');
      Object.assign(d.style, {
        position: 'fixed', left: `${r.left - 6}px`, top: `${r.top - 6}px`,
        width: `${r.width + 12}px`, height: `${r.height + 12}px`,
        border: '4px solid #ff1744', borderRadius: '6px', zIndex: 9999, pointerEvents: 'none',
        boxShadow: '0 0 18px rgba(255,23,68,.8)',
      });
      const t = document.createElement('div');
      Object.assign(t.style, {
        position: 'absolute', right: '-4px', top: '-26px', background: '#ff1744', color: '#fff',
        font: 'bold 12px sans-serif', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap',
      });
      t.textContent = texto;
      d.appendChild(t);
      document.body.appendChild(d);
    };
    marco(document.getElementById('pieces').parentElement, 'PIEZAS sigue subiendo');
    marco(document.getElementById('next-canvas'), 'NEXT sigue cambiando');

    const etiqueta = document.createElement('div');
    Object.assign(etiqueta.style, {
      position: 'fixed', left: '12px', right: '12px', top: '8px', zIndex: 9999,
      background: 'rgba(255,23,68,.95)', color: '#fff', font: 'bold 14px monospace',
      padding: '8px 10px', borderRadius: '6px', lineHeight: '1.4',
    });
    document.body.appendChild(etiqueta);
    const t0 = performance.now();
    setInterval(() => {
      const s = ((performance.now() - t0) / 1000).toFixed(1);
      etiqueta.innerHTML =
        `BUG: el bucle sigue tras GAME OVER (${s} s)<br>` +
        `frames nuevos: ${animId - inicio.animId} · piezas: ${inicio.pieces} → ${pieces}`;
    }, 100);
  }, alGameOver);

  // Capturas durante 5 s tras el GAME OVER, para el GIF
  const frames = [];
  for (let i = 0; i < 25; i++) {
    const f = path.join(SALIDA, `frame-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: f });
    frames.push(f);
    await page.waitForTimeout(200);
  }
  const final = await page.evaluate(() => ({ animId, pieces, gameOver }));
  console.log('5 s después:', final);
  fs.copyFileSync(frames[frames.length - 1], path.join(SALIDA, 'game-over-marcado.png'));

  const video = page.video();
  await page.close();
  await video.saveAs(path.join(SALIDA, 'bug-game-over.webm'));
  await context.close();
  await browser.close();
  fs.writeFileSync(path.join(SALIDA, 'resultado.json'), JSON.stringify({ porGravedad, alGameOver, final }, null, 2));
})();
