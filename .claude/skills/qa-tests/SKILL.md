---
name: qa-tests
description: Crear o actualizar las pruebas Playwright de un requerimiento en la rama qa, ejecutarlas localmente, dejar capturas como evidencia y pedir el PR hacia main solo si todo pasa. Usar cuando se implemente un issue o requerimiento nuevo.
---

# Pruebas QA para un requerimiento

## Cuándo usar
Al implementar un issue o requerimiento nuevo en este repositorio.

## Reglas
- Trabajar siempre en la rama `qa`, creada desde `main` actualizado. Nunca cambiar `main` directamente.
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
3. Ejecutar `ISSUE=N npm test` y confirmar que todas las pruebas pasan.
4. Si alguna falla, corregir la prueba solo si el error está en la prueba. Si el error está en la implementación, reportarlo y detenerse.
5. Hacer commit de `tests/`, `tests/evidencia/issue-N/` y cualquier ajuste, con el trailer de co-autor.
6. Solo si todas las pruebas pasan, abrir el PR de `qa` hacia `main`. En la descripción del PR incluir una tabla: escenario, resultado, fecha y hora de la ejecución, y enlace a la captura.

## Qué no hacer
- No hacer merge del PR. Lo revisa una persona.
- No borrar pruebas existentes para que el resultado sea verde.
- No instalar dependencias nuevas sin registrarlas en `package.json`.
