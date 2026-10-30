---
name: Requerimiento
about: Nuevo requerimiento o corrección. Claude lo implementa y deja evidencia con el flujo QA.
title: ''
labels: ''
---

## Qué se necesita
<!-- Describe el cambio en una o dos frases. -->

## Criterios de aceptación
<!-- Un criterio por línea. Claude verifica cada uno. -->
- [ ] 
- [ ] 

## Pedido a Claude
@claude atiende este issue con la skill `qa-tests`:
1. Implementa lo solicitado.
2. Decide si requiere pruebas automatizadas y explica el motivo.
3. Si las requiere, crea `tests/issue-N.spec.js` (N = número de este issue), con un escenario y una captura por criterio.
4. Si no, deja la verificación de cada criterio en `tests/evidencia/issue-N/verificacion-llm.md`.

Todo en la misma rama. No ejecutes `npm test` y no abras PR hacia `main`.
