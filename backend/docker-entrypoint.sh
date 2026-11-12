#!/bin/sh
set -e

echo "[ENTRYPOINT] Esperando a que PostgreSQL esté listo..."
intento=1
while [ "$intento" -le 60 ]; do
  if npx prisma db push --skip-generate --accept-data-loss >/tmp/prisma-push.log 2>&1; then
    echo "[ENTRYPOINT] Esquema de base de datos sincronizado."
    break
  fi

  echo "[ENTRYPOINT] Base de datos no disponible (intento $intento/60)."
  sleep 2
  intento=$((intento + 1))
done

if [ "$intento" -gt 60 ]; then
  echo "[ENTRYPOINT] ERROR: no se pudo conectar a PostgreSQL."
  cat /tmp/prisma-push.log || true
  exit 1
fi

TEMPLATE_FILE="${TEMPLATE_PATH:-/app/templates/Notas.docx}"
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "[ENTRYPOINT] No existe la plantilla $TEMPLATE_FILE. Generando plantilla base..."
  node dist/scripts/createTemplate.js || true
fi

if [ -n "${ROOT_EMAIL:-}" ] && [ -n "${ROOT_PASSWORD:-}" ]; then
  echo "[ENTRYPOINT] Creando/actualizando usuario ROOT..."
  node dist/scripts/seedAdmin.js
fi

echo "[ENTRYPOINT] Iniciando API..."
exec node dist/src/server.js
