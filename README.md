# FACES UC · Sistema de Constancias de Notas de Postgrado

Sistema interno de la **Facultad de Ciencias Económicas y Sociales (FACES)** de la
**Universidad de Carabobo (UC)**. Un usuario autorizado inicia sesión, busca un estudiante
por cédula, revisa su expediente y genera su constancia de notas (`.docx`, PDF o impresión)
a partir de una plantilla institucional de Word.

El expediente académico **no vive en este sistema**: se consulta en una base MySQL llamada
SUCAI (vista `v_expedientes_alumnos_completo`). Este sistema guarda solo sus usuarios, los
tokens de correo y el registro de consultas.

---

## 1. Arquitectura

```text
navegador ──▶ Nginx (frontend React) ──/api──▶ Backend Express ──┬─▶ PostgreSQL 16   (usuarios, tokens, auditoría)
                                                                 ├─▶ MySQL SUCAI     (expedientes, solo lectura)
                                                                 ├─▶ Notas.docx → .docx / PDF
                                                                 └─▶ SMTP Gmail      (invitaciones, recuperación)
```

Servicios de `docker-compose.yml`:

| Servicio | Imagen / build | Puerto host (por defecto) | Notas |
|---|---|---|---|
| `db` | `postgres:16-alpine` | no se publica | volumen `facesuc-pgdata` |
| `backend` | `./backend` (Node 22) | `4000` | espera a `db` y sincroniza el esquema |
| `frontend` | `./frontend` (Nginx) | `5173` → 80 | proxy de `/api/` a `backend:4000` |

La **base MySQL de SUCAI no está en este compose**: es un servicio aparte (ver §3).

Más detalle del stack: [`docs/architecture.md`](docs/architecture.md).

---

## 2. Roles y acceso

| Rol | Puede |
|---|---|
| `ROOT` | Todo lo del ADMIN + gestionar usuarios (`/usuarios`). Inicia sesión con su **correo** (no tiene cédula). |
| `ADMIN` | Buscar estudiantes y generar constancias. Inicia sesión con su cédula o correo. |

El usuario ROOT se crea/actualiza en cada arranque del backend con `ROOT_EMAIL`,
`ROOT_PASSWORD` y `ROOT_NOMBRE`. No existe ningún administrador por defecto: el ROOT crea
los demás desde la pantalla de usuarios y a cada uno le llega una invitación por correo.

Rutas del frontend: `/login`, `/olvide`, `/restablecer`, `/confirmar-eliminacion` (públicas);
`/` (panel), `/imprimir/:cedula` (ROOT y ADMIN); `/usuarios` (solo ROOT).

---

## 3. Base de datos de estudiantes (MySQL SUCAI)

El backend lee `v_expedientes_alumnos_completo` con las variables `SUCAI_DB_*`. Es solo
lectura: no escribe nada ahí.

- **Desarrollo local:** un contenedor MySQL con el respaldo restaurado, accesible en
  `127.0.0.1:3306`. Desde Docker el backend lo alcanza como `host.docker.internal`.
- **Producción:** un MySQL propio en su propio compose (ver §10), unido al backend por una
  red Docker compartida. No comparte contenedor, volumen ni puerto con ningún otro sistema.

Sacar un respaldo de la base local:

```bash
docker exec <contenedor_mysql> mysqldump -uroot -p --single-transaction --routines \
  --databases <nombre_bd> > backup.sql
```

El respaldo contiene datos personales de estudiantes: **nunca va a git**.

---

## 4. Inicio rápido con Docker (local)

### 4.1 Requisitos

- Docker Engine 24+ con Compose v2.
- Un MySQL con la base de SUCAI restaurada y accesible desde el host.
- `backend/templates/Notas.docx` y `backend/templates/logos/{uc,faces-postgrado}.png`
  (ya vienen en el repo). Si falta `Notas.docx`, el contenedor genera una plantilla base.

### 4.2 Variables

```bash
cp .env.example .env
```

Edite `.env`. Lo mínimo para que funcione el compose:

| Variable | Para qué |
|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres propio del sistema |
| `JWT_SECRET` | Firma de tokens, ≥ 16 caracteres (en producción ≥ 32, aleatorio) |
| `ROOT_EMAIL` / `ROOT_PASSWORD` / `ROOT_NOMBRE` | Usuario ROOT inicial |
| `SUCAI_DB_HOST` / `_PORT` / `_USER` / `_PASSWORD` / `_NAME` | MySQL de estudiantes |
| `CORS_ORIGIN` / `APP_URL` | URL del frontend (CORS y enlaces de los correos) |
| `SMTP_USER` / `SMTP_PASS` | Gmail + contraseña de aplicación; sin `SMTP_PASS` los correos solo se escriben en el log |
| `PROFESOR_COORDINACION` | Nombre que firma la constancia |
| `CONTRATO_VALIDACION` | `aviso` (por defecto) o `off`, ver §9 |

Hay una lista comentada de todas en `backend/.env.example`.

### 4.3 Levantar

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:4000/api/health
```

Al arrancar, el backend: espera a Postgres, sincroniza el esquema (`prisma db push`), genera
`Notas.docx` si falta y crea/actualiza el ROOT. Abra **http://localhost:5173** e inicie
sesión con `ROOT_EMAIL` / `ROOT_PASSWORD`.

> Cambiar `ROOT_PASSWORD` en `.env` y reiniciar el backend actualiza la clave del ROOT.

---

## 5. Flujo funcional

```text
Login (cédula o correo + contraseña)
   └─▶ Panel: buscar por cédula  ──▶ GET /api/constancias/:cedula  (registra la consulta)
          ├─ resumen: nombre, programa, créditos, índice académico
          ├─ tabla de notas (nota numérica y en letras)
          └─ acciones: Imprimir (/imprimir/:cedula) · PDF · .docx
```

Administración (solo ROOT): crear usuario → invitación por correo → el invitado define su
contraseña; editar, desactivar y eliminar (la eliminación se confirma por correo).

---

## 6. Plantilla Word `Notas.docx`

Etiquetas con `{{ }}`; bucle de materias con `{{#materias}} … {{/materias}}`, que debe estar
**en la misma fila** de la tabla. Se puede reemplazar el archivo sin reconstruir la imagen
(`./backend/templates` está montado como volumen). Guía de etiquetas y ejemplos:
[`backend/templates/README.md`](backend/templates/README.md).

Generar una plantilla base: `cd backend && npm run template:create`.

---

## 7. API

Base: `/api`. **La fuente de verdad es [`contracts/openapi.yml`](contracts/openapi.yml)**
(ver §9); esto es solo un resumen.

| Método y ruta | Acceso | Descripción |
|---|---|---|
| `GET /api/health` | público | Estado del servicio |
| `POST /api/auth/login` | público | Devuelve `token` y `usuario` |
| `GET /api/auth/me` | autenticado | Usuario actual |
| `POST /api/auth/olvide` | público | Envía correo de recuperación |
| `POST /api/auth/restablecer` | público | Define contraseña con token (invitación o recuperación) |
| `POST /api/auth/eliminacion/confirmar` | público | Confirma la eliminación de cuenta con token |
| `GET /api/constancias/:cedula` | autenticado | Vista previa del expediente |
| `GET /api/constancias/download/:cedula` | autenticado | Constancia `.docx` |
| `GET /api/constancias/pdf/:cedula` | autenticado | Constancia PDF |
| `POST /api/consultas` | autenticado | Registra una consulta |
| `GET/POST /api/usuarios`, `PATCH/DELETE /api/usuarios/:id` | ROOT | Gestión de usuarios |

Los endpoints de login, olvide, restablecer y eliminación tienen límite de intentos.

Ejemplo:

```bash
TOKEN=$(curl -s http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"usuario":"root@ejemplo.com","password":"..."}' | jq -r .token)

curl -L -o Constancia.docx -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/constancias/download/12345678
```

Cálculos (backend): créditos cursados = Σ `uc`; aprobados = Σ `uc` de materias aprobadas;
índice = Σ(nota × uc) / Σ uc, con dos decimales y coma (`18,33`); nota en letras en español.

---

## 8. Estructura del proyecto

```text
.
├── docker-compose.yml        # db (Postgres) + backend + frontend
├── .env.example              # variables del compose
├── AGENTS.md / CLAUDE.md     # reglas para agentes
├── PROGRESO.md               # cola de tareas
├── PRODUCT.md / DESIGN.md    # contexto y sistema de diseño de la interfaz
├── contracts/                # openapi.yml (verdad de la API), CAMBIOS.md, dist/ (generado)
├── plans/                    # planes por tarea
├── docs/                     # architecture.md, decisions/ (ADR), diagramas/, negocio/
├── database/schema.sql       # referencia; la fuente real es backend/prisma/schema.prisma
├── backend/
│   ├── prisma/schema.prisma  # Usuario, ConsultaEstudiante, TokenUsuario
│   ├── scripts/              # seedAdmin (ROOT), createTemplate, probarContrato
│   ├── templates/            # Notas.docx, logos/
│   ├── docker-entrypoint.sh
│   └── src/
│       ├── app.ts, server.ts, config/env.ts (Zod)
│       ├── lib/              # prisma.ts, sucai.ts (pool MySQL)
│       ├── middleware/       # auth, contrato, errorHandler
│       ├── routes/           # auth, constancias, consulta, usuarios
│       └── services/         # auth, constancia, consulta, docx, pdf, mail, token, usuario
└── frontend/
    ├── nginx.conf            # SPA + proxy /api → backend:4000
    └── src/                  # pages/, components/, context/, api/client.ts, utils/
```

---

## 9. Desarrollo local (sin Docker para el código)

Requiere Postgres y el MySQL de SUCAI accesibles.

```bash
# backend
cd backend
cp .env.example .env        # ajuste DATABASE_URL, JWT_SECRET, SUCAI_DB_*
npm install
npx prisma generate && npx prisma db push
npm run seed:admin          # crea/actualiza el ROOT
npm run dev                 # http://localhost:4000

# frontend
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173 (proxy /api → :4000)
```

Scripts del backend: `dev`, `build`, `start`, `prisma:generate`, `prisma:push`, `seed:admin`,
`template:create`. Frontend: `dev`, `build` (`tsc --noEmit` + Vite), `preview`.

### Contrato de la API

El contrato va primero: todo cambio de API empieza en `contracts/openapi.yml`, con entrada en
`contracts/CAMBIOS.md`. Tras cambiarlo:

```bash
cd contracts
npx -y @redocly/cli@2.70.0 lint
npx -y @redocly/cli@2.70.0 bundle openapi.yml -o dist/openapi.bundled.yml
```

El backend valida respuestas contra `dist/openapi.bundled.yml` en modo `aviso` (registra la
deriva como líneas `[contrato]`, no bloquea). `dist/` es generado: no se edita. En Docker se
monta en solo lectura, así que **debe existir antes de levantar el compose**.

---

## 10. Despliegue en un VPS

Esquema recomendado cuando el VPS ya aloja otros sistemas: **piezas independientes**, cada
una en su carpeta y con su propio `docker compose`, sin compartir nombres, volúmenes ni
puertos publicados con lo que ya corre.

```text
VPS
├─ <otro sistema>        ← no se toca
├─ ~/facesuc-mysql/      ← pieza 1: MySQL de estudiantes
└─ ~/facesuc-/           ← pieza 2: este sistema (frontend + backend + Postgres)
          └─ pieza 1 y 2 se comunican por la red Docker `estudiantes-net`
```

### 10.1 Pieza 1: MySQL de estudiantes

```bash
mkdir -p ~/facesuc-mysql/dump
docker network create estudiantes-net
scp backup.sql usuario@IP_VPS:~/facesuc-mysql/dump/     # desde su máquina
```

`~/facesuc-mysql/docker-compose.yml`:

```yaml
name: facesuc-mysql
services:
  mysql:
    image: mysql:8.4                 # misma versión que el MySQL local
    container_name: facesuc-mysql-estudiantes
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql_estudiantes:/var/lib/mysql
      - ./dump:/docker-entrypoint-initdb.d:ro   # importa el respaldo SOLO en el primer arranque
    networks: [estudiantes-net]      # sin "ports": no es accesible desde fuera
volumes:
  mysql_estudiantes:
networks:
  estudiantes-net:
    external: true
```

Con `~/facesuc-mysql/.env` que contenga `MYSQL_ROOT_PASSWORD=<clave larga>`:

```bash
cd ~/facesuc-mysql && docker compose up -d
docker logs -f facesuc-mysql-estudiantes     # esperar "ready for connections"
docker exec -it facesuc-mysql-estudiantes mysql -uroot -p -e "SHOW DATABASES;"
```

Si el respaldo no trae `CREATE DATABASE`, hay que crear la base antes (por ejemplo con
`MYSQL_DATABASE`). La importación solo corre si el volumen está vacío; para repetirla:
`docker compose down -v` (solo en esta carpeta) y volver a subir.

### 10.2 Pieza 2: este sistema

1. Subir el código (sin `node_modules/`, `dist/` de frontend/backend ni `.git`) a `~/facesuc-/`.
   Deben viajar `backend/templates/` (plantilla y logos) y `contracts/dist/`.
2. En `docker-compose.yml`, unir el backend a la red de la pieza 1 y no exponer la API:

   ```yaml
   backend:
     networks: [facesuc-net, estudiantes-net]
     ports:
       - "127.0.0.1:4000:4000"
   # ...
   networks:
     facesuc-net: { name: facesuc-net, driver: bridge }
     estudiantes-net: { external: true }
   ```
3. Crear `.env` con valores de producción:

   ```text
   SUCAI_DB_HOST=facesuc-mysql-estudiantes
   SUCAI_DB_PORT=3306
   SUCAI_DB_USER=...            SUCAI_DB_PASSWORD=...        SUCAI_DB_NAME=<base del respaldo>
   POSTGRES_PASSWORD=<nueva>    JWT_SECRET=<aleatorio ≥ 32>  ROOT_PASSWORD=<nueva>
   CORS_ORIGIN=https://su-dominio   APP_URL=https://su-dominio   SMTP_PASS=<si hay correo>
   ```
4. `docker compose up -d --build`, luego `curl http://127.0.0.1:4000/api/health`.
5. Publicar: un proxy inverso con HTTPS (Caddy o Nginx + certbot) hacia `localhost:5173`.

### 10.3 Cuidado con los otros sistemas del VPS

- Ejecute `docker compose …` siempre **dentro de la carpeta correcta**.
- No use `docker system prune` ni `docker volume prune`.
- `docker compose down -v` borra los volúmenes de *esa* carpeta.
- Puertos ya tomados en este VPS por otro sistema: `8080` y `3307`. Este sistema usa `5173`
  y `4000` (solo en `127.0.0.1`).

---

## 11. Seguridad (checklist de producción)

- Cambiar `POSTGRES_PASSWORD`, `JWT_SECRET` y `ROOT_PASSWORD`; los valores por defecto del
  compose son de desarrollo.
- `CORS_ORIGIN` con el dominio real, nunca `*`.
- Servir detrás de HTTPS y no publicar el puerto del backend.
- Usar en `SUCAI_DB_USER` un usuario MySQL con solo `SELECT`, no `root`.
- El MySQL de estudiantes no publica puertos.
- El respaldo `.sql` y los `.env` no van a git.
- Contraseñas con bcrypt; JWT con vencimiento `JWT_EXPIRES_IN` (8 h por defecto); no se
  registran contraseñas ni tokens en logs.
- Tokens de invitación/recuperación/eliminación: de un solo uso, solo se guarda su hash SHA-256.
- Respaldos periódicos del volumen `facesuc-pgdata`.

---

## 12. Solución de problemas

| Síntoma | Causa / solución |
|---|---|
| El backend sale con "Variables de entorno inválidas" | Falta `SUCAI_DB_USER`, `DATABASE_URL`, o `JWT_SECRET` tiene < 16 caracteres. |
| `ECONNREFUSED` / "Access denied" hacia SUCAI | Revise `SUCAI_DB_HOST/PORT/USER/PASSWORD`; en VPS, que el backend esté en `estudiantes-net` y el host sea el nombre del contenedor MySQL. |
| "Table … v_expedientes_alumnos_completo doesn't exist" | El respaldo no se importó o `SUCAI_DB_NAME` es otra base. Verifique con `SHOW DATABASES;`. |
| El compose falla al montar `contracts/dist` | Falta generar el bundle (§9, "Contrato de la API"). |
| `No se encontró la plantilla Word` | Coloque `Notas.docx` en `backend/templates/` o ejecute `npm run template:create`. |
| La tabla de materias no se repite | `{{#materias}}` y `{{/materias}}` deben estar en la misma fila. |
| Los correos no llegan | Sin `SMTP_PASS` solo se escriben en el log; use una contraseña de aplicación de Gmail (16 caracteres, sin espacios). |
| No hay "Guardar como" en Firefox/Safari | No soportan File System Access API; se descarga directo. |
| Error de conexión a Postgres | Espere el healthcheck o revise `docker compose logs db`. |
