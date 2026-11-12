# AGENTS.md — Sistema de Constancias FACES-UC

Reglas para cualquier agente que trabaje en este repo. Léelas antes de tocar nada.

## Metodología
- Design by contract (en adopción, ver `docs/decisions/0001-design-by-contract.md`).
- `contracts/openapi.yml` es la verdad de la API (v0.1.0, línea base de C-01). El contrato
  va primero: todo cambio de API empieza ahí, con entrada en `contracts/CAMBIOS.md`.
- Nunca se edita lo generado (`contracts/dist/`, `contracts/generated/`).
- Lint del contrato: `cd contracts && npx -y @redocly/cli@2.70.0 lint`.
- Tras cambiar el contrato, regenerar el bundle que usa el backend:
  `cd contracts && npx -y @redocly/cli@2.70.0 bundle openapi.yml -o dist/openapi.bundled.yml`.

**Si la tarea tiene plan (`plans/<ID>.md`), el plan manda:** lee solo el plan y los archivos
que nombra; ni la cola, ni el contrato, ni otros `PROGRESO.md`. Si algo choca con el contrato,
**para** y escríbelo en su sección *Bloqueos*. Los planes se escriben con `plans/_template.md`.

## Dónde está qué
- `PROGRESO.md` — la cola: qué sigue y en qué orden. Una tarea por sesión.
- `docs/architecture.md` — stack y cómo encajan las piezas.
- `docs/decisions/` — ADR (por qué se decidió algo).
- `backend/` — API Express + Prisma (`backend/src`, un solo servicio).
- `frontend/` — SPA React + Vite + Tailwind, servida por Nginx.
- `database/` — esquema SQL de referencia (la fuente real es `backend/prisma/schema.prisma`).
- `docs/diagramas/`, `docs/negocio/` — diagramas y documentos de negocio.

## Reglas
- No leas `node_modules/`, lockfiles, `.docx` ni `.excalidraw` salvo que la tarea lo pida.
- `grep -n` antes de abrir un archivo entero.
- Secretos solo en `.env` (nunca en git); documenta variables nuevas en `.env.example`.
- Al terminar una tarea, actualiza `PROGRESO.md` y el `PROGRESO.md` de la carpeta tocada.
