from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los administradores.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.is_admin
        )


class IsInstructorOrAdmin(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los instructores o administradores.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if not hasattr(request.user, "profile"):
            return False

        profile = request.user.profile

        if profile.is_admin:
            return True

        return profile.has_valid_instructor_permissions


class CanEditCourses(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los usuarios que pueden editar cursos.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not hasattr(request.user, "profile"):
            return False

        profile = request.user.profile

        if profile.is_admin:
            return True

        return profile.has_valid_instructor_permissions and profile.can_edit_courses


class CanGradeAssignments(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los usuarios que pueden calificar tareas.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not hasattr(request.user, "profile"):
            return False

        profile = request.user.profile

        if profile.is_admin:
            return True

        return profile.has_valid_instructor_permissions and profile.can_grade
