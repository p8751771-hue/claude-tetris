# Framework de pruebas

**Herramienta:** Playwright (`@playwright/test` 1.64.1, versión fija).

**Dónde está:**
- `tests/tetris.spec.js`: las pruebas.
- `tests/evidencia/`: las capturas por issue y fecha.
- `playwright.config.js`: servidor local en el puerto 8000 y tema oscuro fijo.

**Comandos:**
- `npm ci`: instalar dependencias.
- `npx playwright install chromium`: instalar el navegador.
- `ISSUE=N npm test`: ejecutar las pruebas de un issue.

```mermaid
flowchart LR
  A[playwright.config.js] --> B[Servidor en :8000]
  B --> C[tests/tetris.spec.js]
  C --> D[tests/evidencia]
```

**Regla importante:** el tema depende de la preferencia del sistema. Por eso la configuración fija `colorScheme: 'dark'`.

Más detalle del proceso: [Claude como asistente de pruebas](pruebas-con-claude.md).
