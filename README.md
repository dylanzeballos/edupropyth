# EduProPyth

## Descripción

EduProPyth es una plataforma educativa completa desarrollada con NestJS (backend) y React/TypeScript (frontend). La plataforma permite a instructores crear cursos, gestionar estudiantes y proporcionar una experiencia de aprendizaje interactiva utilizando arquitectura limpia y principios SOLID.

## Características

- **Gestión de Usuarios**: Sistema completo de autenticación con JWT y OAuth (Google, GitHub)
- **Cursos Dinámicos**: Creación y gestión de cursos con contenido multimedia
- **Sistema de Roles**: Administradores, instructores y estudiantes con permisos específicos
- **API RESTful**: Backend construido con NestJS y arquitectura hexagonal
- **Frontend Moderno**: Interfaz reactiva construida con React 19 y TypeScript
- **Autenticación JWT**: Tokens seguros con refresh tokens para la comunicación cliente-servidor
- **Clean Architecture**: Separación clara entre capas de dominio, aplicación, infraestructura y presentación

## Arquitectura

```
edupropyth/
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── auth/           # Módulo de autenticación
│   │   │   ├── application/    # Casos de uso
│   │   │   ├── domain/         # Entidades y reglas de negocio
│   │   │   ├── infrastructure/ # Implementaciones (DB, estrategias)
│   │   │   └── presentation/   # Controladores y DTOs
│   │   ├── users/          # Módulo de usuarios
│   │   ├── courses/        # Módulo de cursos
│   │   ├── config/         # Configuraciones
│   │   └── main.ts         # Punto de entrada
│   ├── test/               # Pruebas E2E
│   └── package.json
├── frontend/               # React TypeScript App
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios y API calls
│   │   ├── store/          # Estado global (Zustand)
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── scripts/                # Scripts de automatización
└── docker-compose.yml
```

## Principios de Arquitectura

### Backend - Clean Architecture (Hexagonal)

El backend sigue los principios de Clean Architecture con separación en 4 capas:

1. **Domain (Dominio)**:
   - Entidades de negocio
   - Interfaces de repositorios
   - Reglas de negocio puras

2. **Application (Aplicación)**:
   - Casos de uso (Use Cases)
   - Lógica de aplicación
   - Orquestación de servicios

3. **Infrastructure (Infraestructura)**:
   - Implementaciones de repositorios (TypeORM)
   - Estrategias de autenticación (Passport)
   - Servicios externos

4. **Presentation (Presentación)**:
   - Controladores REST
   - DTOs (Data Transfer Objects)
   - Validaciones de entrada

## Stack Tecnológico

### Backend
- **NestJS 11**: Framework progresivo de Node.js
- **TypeScript**: Tipado estático
- **TypeORM**: ORM para PostgreSQL
- **PostgreSQL 16**: Base de datos relacional
- **JWT**: Autenticación con tokens
- **Passport**: Middleware de autenticación
- **OAuth2**: Google, GitHub
- **bcrypt**: Hashing de contraseñas
- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de datos

### Frontend
- **React 19**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server ultra-rápido
- **TailwindCSS 4**: Framework de estilos utility-first
- **React Router 7**: Enrutamiento declarativo
- **TanStack Query**: Gestión de estado del servidor
- **Zustand**: Estado global del cliente
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Axios**: Cliente HTTP
- **Framer Motion**: Animaciones
- **Sonner**: Notificaciones toast

### DevOps & Calidad
- **Docker**: Contenedores
- **Docker Compose**: Orquestación de servicios
- **GitHub Actions**: CI/CD
- **Husky**: Git hooks
- **Commitlint**: Validación de commits convencionales
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Formateo de código
- **Jest**: Testing (Backend)
- **Vitest**: Testing (Frontend)
- **Testing Library**: Testing de componentes React

## Prerrequisitos

- Node.js 20+
- npm o yarn
- PostgreSQL 16+
- Git
- Docker & Docker Compose (opcional)

## Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/edupropyth.git
cd edupropyth
```

### 2. Configurar Base de Datos

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d db

# O instalar PostgreSQL localmente y crear la base de datos
createdb edupropyth
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones (TypeORM sincroniza automáticamente en desarrollo)

# Ejecutar servidor de desarrollo
npm run start:dev
```

El backend estará disponible en: http://localhost:3000

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## Instalación con Docker

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Parar servicios
docker-compose down

# Parar servicios y eliminar volúmenes
docker-compose down -v
```

## Ejecutar Pruebas

### Backend
```bash
cd backend

# Ejecutar todas las pruebas unitarias
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas E2E
npm run test:e2e
```

### Frontend
```bash
cd frontend

# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en CI
npm run test:ci
```

## Calidad de Código

### Backend
```bash
cd backend

# Linting
npm run lint

# Formateo automático
npm run format

# Verificación de tipos
npm run build
```

### Frontend
```bash
cd frontend

# Linting
npm run lint

# Linting con corrección automática
npm run lint:fix

# Verificación de tipos
npm run type-check

# Build de producción (verifica todo)
npm run build
```

## Comandos Útiles

### Backend
```bash
npm run start          # Iniciar servidor
npm run start:dev      # Iniciar servidor en modo desarrollo (watch)
npm run start:debug    # Iniciar servidor en modo debug
npm run start:prod     # Iniciar servidor en modo producción
npm run build          # Construir para producción
npm run format         # Formatear código con Prettier
npm run lint           # Ejecutar ESLint
npm test               # Ejecutar pruebas
npm run test:cov       # Ejecutar pruebas con cobertura
npm run test:e2e       # Ejecutar pruebas E2E
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Construir para producción
npm run preview        # Preview de producción local
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Arreglar problemas de linting
npm run type-check     # Verificar tipos TypeScript
npm test               # Ejecutar pruebas con Vitest
npm run test:coverage  # Ejecutar pruebas con cobertura
```

## Variables de Entorno

### Backend (.env)
```env
# Servidor
NODE_ENV=development
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=edupropyth

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-me-in-production
JWT_REFRESH_EXPIRATION=30d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Estructura de Módulos

### Módulo de Autenticación (auth)

```
auth/
├── application/
│   └── use-cases/
│       ├── login.use-case.ts
│       ├── register.use-case.ts
│       └── validate-user.use-case.ts
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   └── interfaces/
│       ├── auth-repository.interface.ts
│       └── jwt-payload.interface.ts
├── infrastructure/
│   ├── persistence/
│   │   └── typeorm-auth.repository.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       ├── google.strategy.ts
│       └── github.strategy.ts
└── presentation/
    ├── controllers/
    │   └── auth.controller.ts
    └── dto/
        ├── login.dto.ts
        ├── register.dto.ts
        └── auth-response.dto.ts
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/refresh` - Renovar access token
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado
- `GET /api/auth/google` - Iniciar OAuth con Google
- `GET /api/auth/google/callback` - Callback de Google OAuth
- `GET /api/auth/github` - Iniciar OAuth con GitHub
- `GET /api/auth/github/callback` - Callback de GitHub OAuth

### Usuarios

- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (Soft delete)

### Cursos

- `GET /api/courses` - Listar cursos
- `GET /api/courses/:id` - Obtener curso por ID
- `POST /api/courses` - Crear curso (Teacher/Admin)
- `PUT /api/courses/:id` - Actualizar curso
- `DELETE /api/courses/:id` - Eliminar curso

## CI/CD

El proyecto utiliza GitHub Actions para:

- **Linting**: Verificación de código con ESLint
- **Type Checking**: Verificación de tipos TypeScript
- **Pruebas**: Ejecución automática de test suites
- **Build**: Construcción de aplicaciones
- **Docker**: Construcción y prueba de imágenes (futuro)

### Flujos de Trabajo

1. **CI Frontend**: Se ejecuta en pushes/PRs al directorio frontend
2. **CI Backend**: Se ejecuta en pushes/PRs al directorio backend
3. **Validación de Commits**: Commitlint verifica convenciones

## Convenciones de Código

### Commits (Conventional Commits)

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: extract user service logic
test: add user registration tests
chore: update dependencies
perf: improve query performance
ci: update GitHub Actions workflow
```

### Estructura de Archivos

- **Archivos**: kebab-case (e.g., `user.entity.ts`)
- **Clases**: PascalCase (e.g., `UserEntity`)
- **Funciones/Variables**: camelCase (e.g., `getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (e.g., `AUTH_REPOSITORY`)
- **Interfaces**: PascalCase con prefijo I (e.g., `IAuthRepository`)

## Patrones de Diseño Utilizados

### Backend

- **Dependency Injection**: Inyección de dependencias con NestJS
- **Repository Pattern**: Abstracción de acceso a datos
- **Use Case Pattern**: Casos de uso para lógica de aplicación
- **Strategy Pattern**: Estrategias de autenticación (JWT, OAuth)
- **Factory Pattern**: Creación de objetos complejos
- **DTO Pattern**: Transferencia de datos entre capas

### Frontend

- **Custom Hooks**: Reutilización de lógica
- **Compound Components**: Componentes compuestos
- **Render Props**: Composición flexible
- **Context API**: Estado compartido
- **Query Pattern**: TanStack Query para server state

## Seguridad

- ✅ Hashing de contraseñas con bcrypt
- ✅ JWT con refresh tokens
- ✅ Validación de DTOs con class-validator
- ✅ CORS configurado
- ✅ Rate limiting (futuro)
- ✅ Helmet para headers de seguridad (futuro)
- ✅ SQL Injection prevention (TypeORM)
- ✅ XSS protection

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Instala las dependencias: `npm install` (en root para hooks)
4. Haz commit de tus cambios (`git commit -m 'feat: add amazing feature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

### Guía de Contribución

- Sigue las convenciones de código establecidas
- Escribe pruebas para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Los commits deben seguir Conventional Commits
- El código debe pasar todos los checks de CI

## Reportar Problemas

Si encuentras algún problema:

1. Revisa los [issues existentes](https://github.com/tu-usuario/edupropyth/issues)
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Versiones del software (Node, npm, etc.)
   - Screenshots si es relevante
   - Logs de error

## Roadmap

### v1.0 (MVP)
- [x] Sistema de autenticación JWT
- [x] OAuth con Google y GitHub
- [x] Gestión de usuarios
- [x] CRUD de cursos
- [ ] Sistema de inscripción a cursos
- [ ] Panel de administración


## Rendimiento

- **Backend**: NestJS proporciona excelente rendimiento con Node.js
- **Frontend**: Vite ofrece HMR instantáneo y builds optimizados
- **Base de datos**: PostgreSQL con índices optimizados
- **CDN**: Cloudflare para assets estáticos (producción)

## Despliegue

### Backend (Recomendaciones)
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Frontend (Recomendaciones)
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Base de Datos
- Railway PostgreSQL
- Render PostgreSQL
- Supabase
- AWS RDS
- DigitalOcean Managed Databases

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Equipo

- **Desarrollador Principal**: [Dylan Zeballos](https://github.com/dylanzeballos)
- **Contribuidores**: Ver [CONTRIBUTORS.md](CONTRIBUTORS.md)

## Agradecimientos

- NestJS y React communities
- Todos los contribuidores del proyecto
- Librerías y herramientas open source utilizadas
- Patrones de Clean Architecture por Robert C. Martin

## Recursos de Aprendizaje

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## Soporte

¿Necesitas ayuda?

- 📧 Email: soporte@edupropyth.com
- 💬 Discord: [Servidor de la comunidad](https://discord.gg/edupropyth)
- 📖 Wiki: [Documentación extendida](https://github.com/tu-usuario/edupropyth/wiki)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dylanzeballos/edupropyth)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/edupropyth/issues)

---

## Estado del Proyecto

![CI Backend](https://github.com/tu-usuario/edupropyth/workflows/CI%20Backend/badge.svg)
![CI Frontend](https://github.com/tu-usuario/edupropyth/workflows/CI%20Frontend/badge.svg)
![License](https://img.shields.io/github/license/tu-usuario/edupropyth)
![Stars](https://img.shields.io/github/stars/tu-usuario/edupropyth)

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!** ⭐

---

**Hecho con ❤️ usando NestJS, React y TypeScript**
