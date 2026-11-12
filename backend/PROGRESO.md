# backend — estado

API Express (un solo servicio, `src/`). Rutas montadas en `src/app.ts` bajo `/api/*`.
Prisma (`prisma/schema.prisma`) es la fuente del esquema. Contrato: `../contracts/openapi.yml` (v0.2.0). Valida contra el contrato en modo aviso (`src/middleware/contrato.ts`, `CONTRATO_VALIDACION`). Comprobación: `npx tsx scripts/probarContrato.ts`.

PDF de constancia (`src/services/pdf.service.ts`) con el formato de Notas.docx: encabezado institucional (escudo UC, texto, logo Postgrado FACES), tabla con cuadrícula, totales punteados y nombre de la profesora al pie (`PROFESOR_COORDINACION`, por defecto "Prof. Karla Padrón"). Logo `faces.png` (escudo + FACES) eliminado; `LOGO_FACES_PATH` pasó a `LOGO_POSTGRADO_PATH`.

Usuarios (2026-11-12): `usuarios.cedula` es nullable; solo el ROOT la tiene nula. El seed (`scripts/seedAdmin.ts`) crea/actualiza solo el ROOT, por `ROOT_EMAIL`; se quitaron `ADMIN_*` y `ROOT_CEDULA`.
