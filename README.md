# EduProPyth

## Descripción

EduProPyth es una plataforma educativa completa desarrollada con Django (backend) y React/TypeScript (frontend). La plataforma permite a instructores crear cursos, gestionar estudiantes y proporcionar una experiencia de aprendizaje interactiva.

## Características

- **Gestión de Usuarios**: Sistema completo de autenticación con OAuth (Google, GitHub, Microsoft)
- **Cursos Dinámicos**: Creación y gestión de cursos con contenido multimedia
- **Sistema de Roles**: Administradores, instructores y estudiantes con permisos específicos
- **API RESTful**: Backend completamente documentado con Django REST Framework
- **Frontend Moderno**: Interfaz reactiva construida con React y TypeScript
- **Autenticación JWT**: Tokens seguros para la comunicación cliente-servidor

## Arquitectura

```
edupropyth/
├── backend/          # Django REST API
│   ├── apps/         # Aplicaciones Django
│   ├── config/       # Configuración del proyecto
│   └── requirements/ # Dependencias Python
├── frontend/         # React TypeScript App
├── scripts/          # Scripts de automatización
└── docker-compose.yml
```

## Stack Tecnológico

### Backend
- **Django 4.x**: Framework web
- **Django REST Framework**: API REST
- **PostgreSQL**: Base de datos principal
- **JWT**: Autenticación
- **OAuth2**: Integración con proveedores externos
- **Celery**: Tareas asíncronas (futuro)

### Frontend
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **TailwindCSS**: Framework de estilos
- **React Router**: Enrutamiento
- **Axios**: Cliente HTTP

### DevOps & Calidad
- **Docker**: Contenedores
- **GitHub Actions**: CI/CD
- **pre-commit**: Hooks de git
- **Black, flake8, isort**: Linting Python
- **ESLint, Prettier**: Linting JavaScript/TypeScript

## Prerrequisitos

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Git
- Docker (opcional)

## Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/edupropyth.git
cd edupropyth
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements/dev.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
python manage.py runserver
```

### 3. Configurar Frontend

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

## Instalación con Docker

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

## Ejecutar Pruebas

### Backend
```bash
cd backend
source venv/bin/activate

# Ejecutar todas las pruebas
pytest

# Con cobertura
pytest --cov=src --cov=apps --cov-report=html

# Pruebas específicas
pytest apps/users/tests/
```

### Frontend
```bash
cd frontend

# Ejecutar pruebas
npm test

# Con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

## Calidad de Código

### Backend
```bash
cd backend
source venv/bin/activate

# Linting
make lint

# Formateo automático
make format

# Todos los checks
make check

# Checks de seguridad
make security
```

### Frontend
```bash
cd frontend

# Linting
npm run lint

# Formateo automático
npm run format

# Verificación de tipos
npm run type-check
```

## Comandos Útiles

### Backend (Makefile)
```bash
make help         # Ver todos los comandos disponibles
make install      # Instalar dependencias
make test         # Ejecutar pruebas
make migrations   # Crear migraciones
make migrate      # Aplicar migraciones
make shell        # Abrir shell de Django
make superuser    # Crear superusuario
make runserver    # Ejecutar servidor de desarrollo
```

### Frontend
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Construir para producción
npm run preview   # Preview de producción
npm run lint:fix  # Arreglar problemas de linting
```

## Variables de Entorno

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=edupropyth
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# OAuth Configurations
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## CI/CD

El proyecto utiliza GitHub Actions para:

- **Linting**: Verificación de código con flake8, black, ESLint
- **Pruebas**: Ejecución automática de test suites
- **Seguridad**: Escaneo con bandit y npm audit
- **Docker**: Construcción y prueba de imágenes
- **Despliegue**: Automático a staging/producción

### Flujos de Trabajo

1. **CI (Continuous Integration)**: Se ejecuta en PRs y pushes
2. **CD (Continuous Deployment)**: Se ejecuta en releases

## API Documentación

Una vez que el servidor esté ejecutándose, puedes acceder a:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Admin Panel**: http://localhost:8000/admin/

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Instala pre-commit hooks: `pre-commit install`
4. Haz commit de tus cambios (`git commit -m 'Add: amazing feature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

### Convenciones de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with black
refactor: extract user service logic
test: add user registration tests
```

### Reportar Problemas

Si encuentras algún problema:

1. Revisa los [issues existentes](https://github.com/tu-usuario/edupropyth/issues)
2. Crea un nuevo issue con:
   - Descripción detallada
   - Pasos para reproducir
   - Versiones del software
   - Screenshots si es relevante

## Roadmap

- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con plataformas de videoconferencia
- [ ] Módulo de evaluaciones y exámenes
- [ ] Sistema de gamificación
- [ ] App móvil con React Native
- [ ] Integración con LMS externos

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Equipo

- **Desarrollador Principal**: [Tu Nombre](https://github.com/tu-usuario)
- **Contribuidores**: Ver [CONTRIBUTORS.md](CONTRIBUTORS.md)

## Agradecimientos

- Django y React communities
- Todos los contribuidores del proyecto
- Librerías y herramientas open source utilizadas

---

## Soporte

¿Necesitas ayuda? 

- 📧 Email: soporte@edupropyth.com
- 💬 Discord: [Servidor de la comunidad](https://discord.gg/edupropyth)
- 📖 Wiki: [Documentación extendida](https://github.com/tu-usuario/edupropyth/wiki)

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!** ⭐