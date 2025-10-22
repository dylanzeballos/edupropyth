from datetime import date, timedelta

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient

from apps.courses.models import Course, CourseEdition, Enrollment
from apps.users.models import UserProfile

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def instructor_user():
    user = User.objects.create_user(
        email="instructor@example.com",
        username="instructor",
        password="strong-pass-123",
        first_name="Ada",
        last_name="Lovelace",
    )
    profile = user.profile
    profile.role = UserProfile.INSTRUCTOR_EDITOR
    profile.can_edit_courses = True
    profile.save()
    return user


@pytest.fixture
def student_user():
    return User.objects.create_user(
        email="student@example.com",
        username="student",
        password="strong-pass-123",
        first_name="Alan",
        last_name="Turing",
    )


@pytest.fixture
def course():
    return Course.objects.create(
        title="Python Fundamentals",
        description="Curso introductorio de Python",
        summary="Aprende lo básico de Python",
    )


def test_course_list_returns_data(api_client, course):
    url = reverse("courses:course-list")
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["count"] == 1
    assert response.data["results"][0]["slug"] == course.slug


def test_course_create_requires_permissions(api_client, course):
    user = User.objects.create_user(
        email="viewer@example.com",
        username="viewer",
        password="strong-pass-123",
    )
    api_client.force_authenticate(user=user)

    payload = {
        "title": "New Course",
        "description": "Contenido",
        "summary": "Resumen",
        "level": Course.LEVEL_BEGINNER,
    }

    response = api_client.post(reverse("courses:course-list"), payload, format="json")
    assert response.status_code == 403


def test_course_create_with_permission(api_client, instructor_user):
    api_client.force_authenticate(user=instructor_user)

    payload = {
        "title": "Advanced Python",
        "description": "Profundiza en Python",
        "summary": "Temas avanzados",
        "level": Course.LEVEL_INTERMEDIATE,
    }

    response = api_client.post(reverse("courses:course-list"), payload, format="json")
    assert response.status_code == 201
    created = Course.objects.get(slug="advanced-python")
    assert created.level == Course.LEVEL_INTERMEDIATE


def test_course_edition_creation_and_listing(api_client, instructor_user, course):
    api_client.force_authenticate(user=instructor_user)
    edition_payload = {
        "name": "2025-I",
        "start_date": date.today(),
        "end_date": date.today() + timedelta(days=60),
        "instructors": [instructor_user.id],
    }
    list_url = reverse(
        "courses:course-edition-list", kwargs={"course_slug": course.slug}
    )

    create_response = api_client.post(list_url, edition_payload, format="json")
    assert create_response.status_code == 201

    list_response = api_client.get(list_url)
    assert list_response.status_code == 200
    assert list_response.data["count"] == 1
    assert list_response.data["results"][0]["name"] == "2025-I"


def test_course_edition_archive_flow(api_client, instructor_user, student_user, course):
    edition = CourseEdition.objects.create(
        course=course,
        name="2025-I",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=30),
    )
    edition.instructors.add(instructor_user)

    Enrollment.objects.create(
        student=student_user,
        edition=edition,
        instructor=instructor_user,
    )

    api_client.force_authenticate(user=instructor_user)
    archive_url = reverse(
        "courses:course-edition-archive",
        kwargs={"course_slug": course.slug, "edition_slug": edition.slug},
    )

    response = api_client.post(archive_url, {"notes": "Finalizado"}, format="json")
    assert response.status_code == 200
    edition.refresh_from_db()
    assert edition.is_archived is True
    assert edition.archive_notes == "Finalizado"
    assert "students" in response.data["archive_snapshot"]


def test_course_edition_enrollments_requires_permission(api_client, course):
    edition = CourseEdition.objects.create(
        course=course,
        name="2025-I",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=30),
    )
    enroll_url = reverse(
        "courses:course-edition-enrollments",
        kwargs={"course_slug": course.slug, "edition_slug": edition.slug},
    )

    response = api_client.get(enroll_url)
    assert response.status_code == 401


def test_course_edition_enrollment_create_and_list(
    api_client, instructor_user, student_user, course
):
    edition = CourseEdition.objects.create(
        course=course,
        name="2025-I",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=30),
    )
    edition.instructors.add(instructor_user)

    api_client.force_authenticate(user=instructor_user)
    enroll_url = reverse(
        "courses:course-edition-enrollments",
        kwargs={"course_slug": course.slug, "edition_slug": edition.slug},
    )

    create_resp = api_client.post(
        enroll_url,
        {"student": student_user.id, "instructor": instructor_user.id},
        format="json",
    )
    assert create_resp.status_code == 201

    list_resp = api_client.get(enroll_url)
    assert list_resp.status_code == 200
    assert len(list_resp.data["results"]) == 1
    assert list_resp.data["results"][0]["student"]["id"] == student_user.id
