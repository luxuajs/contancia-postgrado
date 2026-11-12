# ---------------------------------------------------------------------------
# Etapa 1: compilación TypeScript
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
# IPv4 primero y timeouts cortos: si la red se atasca, falla y reintenta en segundos (no en minutos).
RUN --mount=type=cache,target=/root/.npm NODE_OPTIONS=--dns-result-order=ipv4first npm ci --prefer-offline --no-audit --no-fund --fetch-timeout=30000 --fetch-retries=5

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2: imagen de producción (solo dependencias necesarias)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Reutiliza lo ya descargado en la etapa de build (cliente Prisma incluido) y quita
# las devDependencies: una sola descarga de npm por build, sin red en esta etapa.
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev --no-audit --no-fund

COPY prisma ./prisma

COPY --from=build /app/dist ./dist
COPY templates ./templates
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]
