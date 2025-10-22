# API de Cursos (borrador funcional)

Este documento describe los contratos REST que implementaremos para el dominio de cursos. Se archiva por **edición** (cohorte) individual; un curso puede tener múltiples ediciones activas o archivadas.

## Convenciones
- Base path: `/api/courses/`
- Identificadores:
  - Curso: `slug` (generado automáticamente desde `title`).
  - Edición: `slug` único dentro de un curso (generado a partir de `course.slug` + `name`).
- Respuestas paginadas siguen la configuración DRF (`count`, `next`, `previous`, `results`).
- Permisos:
  - Lectura: `IsAuthenticatedOrReadOnly`.
  - Operaciones de escritura: `apps.users.permissions.admin_permissions.CanEditCourses` o `IsInstructorOrAdmin` según se especifique.

## Endpoints

### 1. Courses

#### GET `/api/courses/`
- Lista paginada de cursos.
- Parámetros opcionales de filtrado (a implementar): `level`, `is_active`.
- Respuesta (`200`):
  ```json
  {
    "count": 1,
    "results": [
      {
        "id": 1,
        "title": "Python Fundamentals",
        "slug": "python-fundamentals",
        "summary": "Bases de Python",
        "level": "beginner",
        "is_active": true,
        "created_at": "2025-01-01T12:00:00Z",
        "updated_at": "2025-01-05T12:00:00Z",
        "active_editions": 1,
        "archived_editions": 1
      }
    ]
  }
  ```

#### POST `/api/courses/`
- Cuerpo (`application/json`):
  ```json
  {
    "title": "Python Fundamentals",
    "description": "Introductorio",
    "summary": "Bases de Python",
    "level": "beginner"
  }
  ```
- Reglas:
  - `title` y `description` obligatorios.
  - `level` ∈ {`beginner`, `intermediate`, `advanced`}.
  - `slug` se genera en el modelo, no se acepta desde el cliente.
- Respuestas:
  - `201` con el curso creado (mismos campos que detalle).
  - `400` por validaciones fallidas.
- Permisos: `CanEditCourses` o `IsInstructorOrAdmin`.

#### GET `/api/courses/{course_slug}/`
- Devuelve detalle de un curso.
- Respuesta (`200`):
  ```json
  {
    "id": 1,
    "title": "Python Fundamentals",
    "slug": "python-fundamentals",
    "description": "Introductorio",
    "summary": "Bases de Python",
    "level": "beginner",
    "is_active": true,
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-05T12:00:00Z",
    "active_editions": 1,
    "archived_editions": 1,
    "latest_editions": [
      {
        "name": "2025-I",
        "slug": "python-fundamentals-2025-i",
        "start_date": "2025-01-10",
        "end_date": "2025-03-20",
        "is_active": true,
        "is_archived": false
      }
    ]
  }
  ```
- `404` si no existe.

### 2. Course Editions

#### GET `/api/courses/{course_slug}/editions/`
- Lista paginada de ediciones del curso.
- Filtros opcionales: `is_active`, `is_archived` (a implementar).
- Respuesta (`200`):
  ```json
  {
    "count": 2,
    "results": [
      {
        "id": 10,
        "name": "2025-I",
        "slug": "python-fundamentals-2025-i",
        "start_date": "2025-01-10",
        "end_date": "2025-03-20",
        "is_active": true,
        "is_archived": false,
        "instructors": [
          {"id": 5, "full_name": "Ada Lovelace", "email": "ada@example.com"}
        ],
        "enrollment_limit": 100
      }
    ]
  }
  ```

#### POST `/api/courses/{course_slug}/editions/`
- Cuerpo:
  ```json
  {
    "name": "2025-II",
    "start_date": "2025-04-10",
    "end_date": "2025-06-20",
    "enrollment_limit": 120,
    "instructors": [5, 6],
    "is_active": true
  }
  ```
- Reglas:
  - Validar `end_date >= start_date` (modelo `clean()`).
  - `instructors` deben existir y se asignan vía M2M.
  - `slug` se genera automáticamente (`course.slug + '-' + slugify(name)`).
- Respuestas:
  - `201` con representación completa de la edición.
  - `400` si hay error de validación.
  - `404` si `course_slug` no existe.
- Permisos: `CanEditCourses` o `IsInstructorOrAdmin`.

#### GET `/api/courses/{course_slug}/editions/{edition_slug}/`
- Devuelve detalle de una edición.
- Si `is_archived` es `true`, incluir:
  ```json
  {
    "archive_snapshot": { "...": "..." },
    "archive_notes": "Semestre finalizado",
    "archived_at": "2025-03-30T10:00:00Z",
    "archived_by": {"id": 5, "full_name": "Ada Lovelace"}
  }
  ```
- `404` si no existe curso o edición.

#### POST `/api/courses/{course_slug}/editions/{edition_slug}/archive/`
- Acción para archivar la edición.
- Cuerpo opcional:
  ```json
  {
    "notes": "Semestre finalizado"
  }
  ```
- Lógica: usa `CourseEdition.archive(by_user=request.user, notes=notes)`.
- Respuestas:
  - `200` con la edición ya archivada (incluye snapshot).
  - `400` / `409` si la edición ya estaba archivada.
  - `404` si no existe.
- Permisos: `CanEditCourses` o `IsInstructorOrAdmin`.

### 3. Enrollments

#### GET `/api/courses/{course_slug}/editions/{edition_slug}/enrollments/`
- Lista los estudiantes inscritos en la edición.
- Respuesta (`200`):
  ```json
  [
    {
      "id": 50,
      "student": {"id": 20, "full_name": "Alan Turing", "email": "alan@example.com"},
      "instructor": {"id": 5, "full_name": "Ada Lovelace", "email": "ada@example.com"},
      "created_at": "2025-01-12T09:00:00Z"
    }
  ]
  ```
- Permisos sugeridos: `IsInstructorOrAdmin` (lectura restringida). Ajustar si se requiere visibilidad para estudiantes.

#### POST `/api/courses/{course_slug}/editions/{edition_slug}/enrollments/` (opcional)
- Cuerpo:
  ```json
  {
    "student": 20,
    "instructor": 5
  }
  ```
- Reglas:
  - `(student, edition)` debe ser único (ya existe constraint).
  - `instructor` debe estar en `edition.instructors` (`Enrollment.clean()`).
  - Se asigna `edition` por la URL.
- Respuestas:
  - `201` con la inscripción creada.
  - `400` si instructor inválido o duplicado.
  - `404` si curso/edición no existen.
- Permisos: `IsInstructorOrAdmin`.

## Errores Comunes
- `400 BAD REQUEST`: validaciones de negocio (fechas, instructor no asignado, edición ya archivada).
- `401 UNAUTHORIZED`: usuario no autenticado para acciones protegidas.
- `403 FORBIDDEN`: usuario autenticado sin permisos (no cumple `CanEditCourses`/`IsInstructorOrAdmin`).
- `404 NOT FOUND`: curso o edición con slug inexistente.
- `409 CONFLICT` (opcional): intentar archivar una edición ya archivada.

## Próximos pasos
1. Implementar serializadores descritos arriba.
2. Crear viewsets/vistas usando esos serializadores.
3. Configurar rutas y permisos.
4. Documentar con `drf-spectacular` y escribir pruebas automatizadas.

Este documento se irá ajustando conforme implementemos o surjan requisitos adicionales (filtros, ordenamientos, acciones extra).
