---
name: qa-tests
description: Crear o actualizar las pruebas Playwright de un requerimiento, con capturas como evidencia. En local se trabaja en la rama qa y se ejecutan las pruebas; en GitHub se escriben en la rama de Claude y las ejecuta el workflow QA al hacer merge a qa. Usar cuando se implemente un issue o requerimiento nuevo.
---

# Pruebas QA para un requerimiento

## Cuándo usar
Al implementar un issue o requerimiento nuevo en este repositorio.

## Dónde se trabaja
Depende de dónde se ejecute la skill:

- **En GitHub (`@claude` en un issue):** la acción crea una rama `claude/issue-N-…` desde `main` y no permite cambiar de rama. Escribe las pruebas en esa rama. No intentes crear ni usar `qa`: la unión a `qa` la hace una persona con una PR. Tampoco puedes ejecutar `npm test`; las pruebas las ejecuta el workflow QA cuando se hace merge hacia `qa`. Si la implementación del requerimiento está en otra rama, avisa que esa rama debe unirse a `qa` antes que la de pruebas.
- **En local:** trabaja en la rama `qa` actualizada desde `main` y ejecuta las pruebas tú mismo.

En ningún caso se cambia `main` directamente.

## Reglas
- Las pruebas viven en `tests/`, una por requerimiento: `tests/issue-N.spec.js`.
- Cada prueba debe partir de un estado conocido. La página sigue la preferencia del sistema, así que `playwright.config.js` fija `colorScheme: 'dark'`; no quitarlo.
- La evidencia siempre queda en `tests/evidencia/issue-N/AAAA-MM-DD_HH-MM-SS/`, donde N es el número del issue y la fecha y hora es la de la ejecución. Cada ejecución crea su propia carpeta; no sobrescribir ejecuciones anteriores.
- Ejecutar con `ISSUE=N npm test`. Sin `ISSUE`, la evidencia cae en `sin-issue/` y no debe usarse en un PR.
- Cada escenario captura su pantalla con un nombre que diga qué verifica (`carga-tablero.png`, `modo-claro.png`, etc.).
- No modificar `index.html`, `game.js` ni `style.css` para que una prueba pase. Si una prueba falla, reportar la causa.

## Referencia
Para explorar la página antes de escribir selectores, seguir el árbol de decisión de `anthropics/skills` → `skills/webapp-testing/SKILL.md`: esperar `networkidle`, tomar captura o inspeccionar el DOM, y luego escribir la prueba con los selectores encontrados. Ese material está en Python; aquí las pruebas se escriben en JavaScript con `@playwright/test`.

## Pasos
1. Leer el requerimiento y escribir un escenario por cada criterio de aceptación.
2. Crear `tests/issue-N.spec.js` con esos escenarios. Cada uno hace una captura con la función `capturar`.
3. En local, ejecutar `ISSUE=N npm test` y confirmar que todas las pruebas pasan. En GitHub, omitir este paso e indicar que la ejecución queda a cargo del workflow QA.
4. Si alguna falla, corregir la prueba solo si el error está en la prueba. Si el error está en la implementación, reportarlo y detenerse.
5. Hacer commit de `tests/` y cualquier ajuste, con el trailer de co-autor. En local, incluir también `tests/evidencia/issue-N/`.
6. En local, solo si todas las pruebas pasan, abrir el PR de `qa` hacia `main` con `Closes #N`. En la descripción incluir una tabla: escenario, resultado, fecha y hora de la ejecución, y enlace a la captura. En GitHub, no abrir PR hacia `main`: indicar que la rama debe unirse a `qa` mediante una PR.

## Qué no hacer
- No hacer merge del PR. Lo revisa una persona.
- No borrar pruebas existentes para que el resultado sea verde.
- No instalar dependencias nuevas sin registrarlas en `package.json`.
