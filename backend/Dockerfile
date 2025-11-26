# =========================
# Stage 1: Build (NestJS)
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo package.json y lock para cachear instalacion
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluye dev)
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar NestJS a dist/
RUN npm run build

# =========================
# Stage 2: Runtime (prod)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Entorno de producción
ENV NODE_ENV=production

# Creamos usuario no root (opcional pero buena práctica)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copiamos solo lo necesario
COPY package.json package-lock.json ./
# Instalar SOLO deps de producción
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el build desde el builder
COPY --from=builder /app/dist ./dist

# Cambiamos a usuario no root
USER nestjs

# App Runner espera en el puerto 3000
EXPOSE 3000

# (Opcional) healthcheck interno del contenedor, no es obligatorio para App Runner
# HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
#   CMD wget -qO- http://localhost:3000/api/health || exit 1

# Comando de arranque de NestJS
CMD ["node", "dist/main.js"]
