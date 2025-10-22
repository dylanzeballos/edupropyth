# Create your views here.
from django.shortcuts import get_object_or_404
from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Course, CourseEdition, Enrollment
from apps.courses.serializers import (
    CourseCreateSerializer,
    CourseDetailSerializer,
    CourseEditionDetailSerializer,
    CourseEditionListSerializer,
    CourseEditionWriteSerializer,
    CourseListSerializer,
    EnrollmentCreateSerializer,
    EnrollmentSerializer,
)
from apps.users.permissions.admin_permissions import (
    CanEditCourses,
    IsInstructorOrAdmin,
)


class CourseViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """ViewSet to list, retrieve and create courses."""

    queryset = Course.objects.all().prefetch_related(
        "editions",
        "editions__instructors",
    )
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseCreateSerializer

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [CanEditCourses()]
        return super().get_permissions()


class CourseEditionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """Manage course editions nested under a course."""

    lookup_field = "slug"
    lookup_url_kwarg = "edition_slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_course(self):
        if not hasattr(self, "_course"):
            self._course = get_object_or_404(Course, slug=self.kwargs["course_slug"])
        return self._course

    def get_queryset(self):
        course = self.get_course()
        return (
            CourseEdition.objects.filter(course=course)
            .select_related("course", "archived_by")
            .prefetch_related(
                "instructors", "enrollments__student", "enrollments__instructor"
            )
        )

    def get_serializer_class(self):
        if self.action == "list":
            return CourseEditionListSerializer
        if self.action == "retrieve":
            return CourseEditionDetailSerializer
        return CourseEditionWriteSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["course"] = self.get_course()
        return context

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [CanEditCourses()]
        return super().get_permissions()


class CourseEditionArchiveView(APIView):
    """Endpoint to archive a course edition."""

    permission_classes = [CanEditCourses]

    def post(self, request, course_slug, edition_slug):
        course = get_object_or_404(Course, slug=course_slug)
        edition = get_object_or_404(
            CourseEdition,
            course=course,
            slug=edition_slug,
        )
        if edition.is_archived:
            return Response(
                {"detail": "Edition is already archived."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        notes = request.data.get("notes")
        edition.archive(by_user=request.user, notes=notes)
        edition.refresh_from_db()
        serializer = CourseEditionDetailSerializer(
            edition, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseEditionEnrollmentListCreateView(generics.ListCreateAPIView):
    """List and create enrollments for a specific course edition."""

    permission_classes = [IsInstructorOrAdmin]

    def get_edition(self):
        course = get_object_or_404(Course, slug=self.kwargs["course_slug"])
        return get_object_or_404(
            CourseEdition, course=course, slug=self.kwargs["edition_slug"]
        )

    def get_queryset(self):
        edition = self.get_edition()
        return (
            Enrollment.objects.filter(edition=edition)
            .select_related("student", "instructor")
            .order_by("created_at")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EnrollmentCreateSerializer
        return EnrollmentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["edition"] = self.get_edition()
        return context
