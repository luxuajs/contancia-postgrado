# Arquitectura

## Stack
- **Backend**: Node + TypeScript, Express, Zod (validación de entorno), JWT + bcryptjs (auth),
  helmet, cors, express-rate-limit, morgan.
- **Datos**: PostgreSQL con Prisma ORM.
- **Documentos**: docxtemplater + pizzip (plantilla `backend/templates/Notas.docx`), pdfkit (PDF).
- **Correo**: nodemailer (`backend/src/services/mail.service.ts`).
- **Frontend**: React + React Router, Vite, Tailwind; servido por Nginx, que hace proxy de `/api` al backend.
- **Despliegue**: Docker Compose (`docker-compose.yml`): db, backend, frontend.

## Cómo encajan
```
navegador ──▶ nginx (frontend) ──/api──▶ backend Express ──▶ PostgreSQL
                                          ├─▶ plantilla Word → .docx / PDF
                                          └─▶ SMTP (correo)
```

Detalle de instalación, variables y uso: `README.md`.
