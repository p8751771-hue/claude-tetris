# Fase 1 · Implementación

**Qué pasa:** Claude escribe el código del requerimiento en su propia rama.

**Quién:** Claude, a partir de `@claude implementa esto` en el issue.

**Resultado:** una rama `claude/issue-N-…` con el cambio y un comentario en el issue con la lista de tareas.

```mermaid
flowchart LR
  A[@claude implementa esto] --> B[Rama claude/issue-N]
  B --> C[Commit y push]
  C --> D[Enlace Create PR]
```

**Siguiente paso:** [Fase 2 · Ejecución de pruebas](fase-2-ejecucion.md).
