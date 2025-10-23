# Docker Guide - EduProPyth

Esta guía detalla cómo usar Docker para desarrollar, probar y desplegar EduProPyth.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Desarrollo Local](#desarrollo-local)
- [Comandos Útiles](#comandos-útiles)
- [Staging](#staging)
- [Producción](#producción)
- [Troubleshooting](#troubleshooting)
- [Mejores Prácticas](#mejores-prácticas)

## Requisitos

- Docker 24.0+
- Docker Compose 2.20+
- Al menos 4GB de RAM disponible
- 10GB de espacio en disco

### Instalación de Docker

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Desarrollo Local

### Configuración Inicial

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/edupropyth.git
cd edupropyth
```

2. **Crear archivos de variables de entorno:**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. **Editar las variables de entorno según necesites**

### Iniciar Servicios

**Iniciar todos los servicios:**
```bash
docker-compose up -d
```

**Iniciar servicios específicos:**
```bash
# Solo base de datos
docker-compose up -d db

# Backend y base de datos
docker-compose up -d backend

# Frontend, backend y base de datos
docker-compose up -d frontend
```

**Ver logs en tiempo real:**
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Servicios Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:5173 | Aplicación React |
| Backend | http://localhost:3000 | API NestJS |
| API Docs | http://localhost:3000/api | Documentación API |
| PostgreSQL | localhost:5432 | Base de datos |
| PgAdmin | http://localhost:5050 | Admin de BD (opcional) |
| Redis | localhost:6379 | Caché (opcional) |

### Servicios Opcionales

**Iniciar PgAdmin:**
```bash
docker-compose --profile tools up -d pgadmin
```

Acceder a: http://localhost:5050
- Email: `admin@edupropyth.com`
- Password: `admin`

**Iniciar Redis:**
```bash
docker-compose --profile cache up -d redis
```

## Comandos Útiles

### Gestión de Contenedores

**Ver estado de servicios:**
```bash
docker-compose ps
```

**Detener servicios:**
```bash
docker-compose stop
```

**Reiniciar servicios:**
```bash
docker-compose restart

# Reiniciar servicio específico
docker-compose restart backend
```

**Detener y eliminar contenedores:**
```bash
docker-compose down
```

**Detener y eliminar contenedores + volúmenes:**
```bash
docker-compose down -v
```

### Ejecutar Comandos en Contenedores

**Acceder a shell del backend:**
```bash
docker-compose exec backend sh
```

**Acceder a shell de PostgreSQL:**
```bash
docker-compose exec db psql -U postgres -d edupropyth
```

**Ejecutar comandos npm en backend:**
```bash
# Instalar dependencias
docker-compose exec backend npm install

# Ejecutar tests
docker-compose exec backend npm test

# Generar migración
docker-compose exec backend npm run migration:generate -- src/migrations/MigrationName

# Ejecutar migraciones
docker-compose exec backend npm run migration:run
```

**Ejecutar comandos npm en frontend:**
```bash
# Instalar dependencias
docker-compose exec frontend npm install

# Ejecutar tests
docker-compose exec frontend npm test

# Lint
docker-compose exec frontend npm run lint
```

### Limpieza

**Limpiar imágenes no usadas:**
```bash
docker image prune -a
```

**Limpiar volúmenes no usados:**
```bash
docker volume prune
```

**Limpiar todo (cuidado!):**
```bash
docker system prune -a --volumes
```

### Reconstruir Imágenes

**Reconstruir todos los servicios:**
```bash
docker-compose build
```

**Reconstruir servicio específico:**
```bash
docker-compose build backend
docker-compose build frontend
```

**Reconstruir sin caché:**
```bash
docker-compose build --no-cache
```

**Reconstruir y reiniciar:**
```bash
docker-compose up -d --build
```

## Staging

### Preparación

1. **Crear archivo de variables de entorno:**
```bash
cp .env.example .env.staging
```

2. **Configurar variables para staging:**
```bash
# .env.staging
NODE_ENV=staging
DB_PASSWORD=strong_staging_password
JWT_SECRET=staging_jwt_secret_change_me
JWT_REFRESH_SECRET=staging_refresh_secret_change_me
REDIS_PASSWORD=staging_redis_password
GOOGLE_CLIENT_ID=your_staging_google_client_id
GOOGLE_CLIENT_SECRET=your_staging_google_secret
GITHUB_CLIENT_ID=your_staging_github_client_id
GITHUB_CLIENT_SECRET=your_staging_github_secret
FRONTEND_URL=https://staging.edupropyth.com
```

### Despliegue

```bash
# Pull de imágenes desde registry
docker-compose -f docker-compose.staging.yml pull

# Iniciar servicios
docker-compose -f docker-compose.staging.yml up -d

# Ver logs
docker-compose -f docker-compose.staging.yml logs -f

# Ejecutar migraciones
docker-compose -f docker-compose.staging.yml exec backend npm run migration:run
```

### Health Check

```bash
# Backend
curl http://localhost:3000/api/health

# Frontend
curl http://localhost/health
```

## Producción

### Preparación

1. **Crear archivo de variables de entorno:**
```bash
cp .env.example .env.production
```

2. **Configurar variables para producción:**
```bash
# .env.production
NODE_ENV=production
DB_PASSWORD=very_strong_production_password
JWT_SECRET=production_jwt_secret_very_secure
JWT_REFRESH_SECRET=production_refresh_secret_very_secure
REDIS_PASSWORD=production_redis_password
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_secret
GITHUB_CLIENT_ID=your_production_github_client_id
GITHUB_CLIENT_SECRET=your_production_github_secret
FRONTEND_URL=https://edupropyth.com
SENTRY_DSN=your_sentry_dsn
```

### Despliegue

```bash
# Load environment variables
set -a
source .env.production
set +a

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# Verify services
docker-compose -f docker-compose.prod.yml ps
```

### Backup de Base de Datos

**Backup manual:**
```bash
docker-compose -f docker-compose.prod.yml run --rm backup /backup.sh
```

**Configurar backup automático con cron:**
```bash
# Editar crontab
crontab -e

# Agregar backup diario a las 2 AM
0 2 * * * cd /opt/edupropyth && docker-compose -f docker-compose.prod.yml run --rm backup /backup.sh >> /var/log/edupropyth-backup.log 2>&1
```

**Restaurar backup:**
```bash
# Listar backups disponibles
ls -lh ./backups/

# Restaurar desde backup
gunzip -c ./backups/edupropyth_backup_20240115_020000.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d edupropyth_prod
```

### Monitoreo

**Ver uso de recursos:**
```bash
docker stats
```

**Ver logs de producción:**
```bash
# Últimas 100 líneas
docker-compose -f docker-compose.prod.yml logs --tail=100

# Logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f --tail=50
```

**Health checks:**
```bash
# Script de health check
cat > healthcheck.sh << 'EOF'
#!/bin/bash
echo "Checking backend health..."
curl -f http://localhost:3000/api/health || exit 1
echo "✓ Backend is healthy"

echo "Checking frontend health..."
curl -f http://localhost/health || exit 1
echo "✓ Frontend is healthy"

echo "✓ All services are healthy"
EOF

chmod +x healthcheck.sh
./healthcheck.sh
```

### Actualizaciones Zero-Downtime

```bash
# 1. Pull nuevas imágenes
docker-compose -f docker-compose.prod.yml pull

# 2. Recrear servicios uno por uno
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
sleep 10

docker-compose -f docker-compose.prod.yml up -d --no-deps --build frontend

# 3. Verificar que todo funcione
./healthcheck.sh

# 4. Limpiar imágenes antiguas
docker image prune -f
```

## Troubleshooting

### El backend no se conecta a la base de datos

```bash
# Verificar que la base de datos esté corriendo
docker-compose ps db

# Ver logs de la base de datos
docker-compose logs db

# Verificar variables de entorno del backend
docker-compose exec backend env | grep DB_

# Probar conexión manualmente
docker-compose exec backend nc -zv db 5432
```

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3000
sudo lsof -i :5173

# Cambiar puertos en docker-compose.yml
ports:
  - "3001:3000"  # Backend
  - "5174:5173"  # Frontend
```

### Contenedor se reinicia constantemente

```bash
# Ver logs para identificar el error
docker-compose logs --tail=50 backend

# Ver intentos de restart
docker-compose ps

# Inspeccionar contenedor
docker inspect edupropyth-backend
```

### Problemas de permisos

```bash
# En Linux, ajustar permisos de volúmenes
sudo chown -R $USER:$USER ./backend
sudo chown -R $USER:$USER ./frontend

# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Base de datos corrupta

```bash
# Detener servicios
docker-compose down

# Eliminar volumen de la base de datos
docker volume rm edupropyth_postgres_data

# Reiniciar y recrear base de datos
docker-compose up -d db

# Esperar a que la BD esté lista
sleep 10

# Ejecutar migraciones
docker-compose exec backend npm run migration:run

# Iniciar otros servicios
docker-compose up -d
```

### Hot reload no funciona

```bash
# Verificar que los volúmenes estén montados correctamente
docker-compose ps

# En macOS, puede necesitar configuración adicional en Docker Desktop:
# Settings > Resources > File Sharing
# Agregar el directorio del proyecto

# Reiniciar contenedor
docker-compose restart backend
docker-compose restart frontend
```

### Lentitud en macOS

```bash
# Usar volume delegated para mejorar performance
# En docker-compose.yml:
volumes:
  - ./backend:/app:delegated
  - ./frontend:/app:delegated

# O usar docker-sync
gem install docker-sync
docker-sync start
```

## Mejores Prácticas

### Desarrollo

1. **Usa volúmenes para código fuente** para hot reload
2. **No incluyas node_modules en volúmenes** para mejor performance
3. **Usa .dockerignore** para excluir archivos innecesarios
4. **Mantén logs bajo control** con driver de logging
5. **Nombra tus contenedores** para fácil identificación

### Producción

1. **Usa multi-stage builds** para imágenes optimizadas
2. **Nunca uses `latest` tag** en producción
3. **Implementa health checks** en todos los servicios
4. **Configura límites de recursos** para evitar consumo excesivo
5. **Usa secrets management** para información sensible
6. **Implementa logging centralizado** (ELK, Loki, etc.)
7. **Monitorea recursos** con Prometheus/Grafana
8. **Backups automáticos** de base de datos
9. **Actualiza imágenes regularmente** para parches de seguridad
10. **Prueba recuperación de desastres** periódicamente

### Seguridad

1. **No uses usuario root** en contenedores
2. **Escanea imágenes** con Trivy o Snyk
3. **Mantén secrets fuera del código** usando .env
4. **Usa redes separadas** para aislar servicios
5. **Implementa rate limiting** en el backend
6. **Configura SSL/TLS** en producción
7. **Audita dependencias** regularmente

### Performance

1. **Usa caché de layers** en builds
2. **Minimiza número de layers** en Dockerfile
3. **Usa Alpine images** cuando sea posible
4. **Implementa Redis** para caché
5. **Configura resource limits** apropiadamente
6. **Usa CDN** para assets estáticos

## Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica el estado: `docker-compose ps`
3. Consulta esta guía de troubleshooting
4. Abre un issue en GitHub

---

**Última actualización:** Enero 2025