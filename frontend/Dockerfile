# ---------------------------------------------------------------------------
# Etapa 1: build de la aplicación React con Vite
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm NODE_OPTIONS=--dns-result-order=ipv4first npm ci --prefer-offline --no-audit --no-fund --fetch-timeout=30000 --fetch-retries=5

COPY . .

# La URL por defecto es /api y Nginx la redirige al backend.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2: servir estáticos con Nginx y proxy hacia el backend
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
