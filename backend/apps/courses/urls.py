from rest_framework.routers import DefaultRouter

from django.urls import include, path

from apps.courses.views import (
    CourseEditionArchiveView,
    CourseEditionEnrollmentListCreateView,
    CourseEditionViewSet,
    CourseViewSet,
)

app_name = "courses"

router = DefaultRouter()
router.register("", CourseViewSet, basename="course")

course_editions = CourseEditionViewSet.as_view(
    {
        "get": "list",
        "post": "create",
    }
)
course_edition_detail = CourseEditionViewSet.as_view(
    {
        "get": "retrieve",
    }
)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "<slug:course_slug>/editions/",
        course_editions,
        name="course-edition-list",
    ),
    path(
        "<slug:course_slug>/editions/<slug:edition_slug>/",
        course_edition_detail,
        name="course-edition-detail",
    ),
    path(
        "<slug:course_slug>/editions/<slug:edition_slug>/archive/",
        CourseEditionArchiveView.as_view(),
        name="course-edition-archive",
    ),
    path(
        "<slug:course_slug>/editions/<slug:edition_slug>/enrollments/",
        CourseEditionEnrollmentListCreateView.as_view(),
        name="course-edition-enrollments",
    ),
]
