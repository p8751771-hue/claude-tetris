# Plan de pruebas

## 1. Objetivo
Verificar que cada cambio de Tetris funciona en el navegador antes de llegar a `main`, y dejar evidencia de cada verificación.

## 2. Alcance
- Aplicación: Tetris en HTML5 Canvas (`index.html`, `game.js`, `style.css`).
- Pruebas: escenarios automatizados con Playwright en `tests/`.
- Fuera de alcance: lógica de juego (puntuación, colisiones) y pruebas de rendimiento.

## 3. Entorno

| Elemento | Valor |
|---|---|
| Herramienta | `@playwright/test` 1.64.1 |
| Navegador | Chromium 156.0.8078.4 |
| Sistema (CI) | GitHub Actions `ubuntu-24.04` |
| Sistema (local) | Linux |
| Viewport | 1080 × 1920 |
| Tema | oscuro fijo (`colorScheme: 'dark'`) |

## 4. Casos de prueba

| ID | Escenario | Resultado esperado | Captura |
|---|---|---|---|
| TC-01 | Carga del tablero y del botón de tema | `#board` y `#theme-toggle` visibles | `carga-tablero.png` |
| TC-02 | Modo claro | Al pulsar el botón, `data-theme` vale `light` | `modo-claro.png` |
| TC-03 | Vuelta al modo oscuro | Dos pulsaciones devuelven `data-theme` a `dark` | `modo-oscuro.png` |

Cada requerimiento agrega sus propios casos con un ID nuevo en `tests/issue-N.spec.js`.

## 5. Criterios de aceptación
1. Todos los casos del requerimiento pasan.
2. Cada caso tiene su captura en `tests/evidencia/issue-N/AAAA-MM-DD_HH-MM-SS/`.
3. El comentario del issue muestra el resultado, el modelo, el navegador y el dispositivo.
4. Una persona aprueba antes de cualquier merge a `main`.

## 6. Ejecución
- Local: `ISSUE=N npm test`.
- En GitHub: Actions → QA → Run workflow → `issue = N`.

## 7. Riesgos conocidos
- **Preferencia de tema del sistema:** la página sigue el tema del sistema. Por eso la configuración fija el tema oscuro.
- **Título del juego:** el issue #2 no está fusionado, así que no hay casos para él.
- **Captura de fallos:** si una prueba falla, la captura se guarda en `fallo/`, no en la carpeta principal.

## 8. Responsables
- **Claude:** escribe los casos y ejecuta las pruebas, siguiendo la skill `qa-tests`.
- **Persona:** revisa la evidencia y aprueba el merge.

Ver también: [Claude como asistente de pruebas](pruebas-con-claude.md) y [Framework de pruebas](framework-pruebas.md).
