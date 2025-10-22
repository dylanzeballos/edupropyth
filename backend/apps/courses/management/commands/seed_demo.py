from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.courses.models import Course, CourseEdition, Enrollment
from apps.users.models import UserProfile


class Command(BaseCommand):
    help = "Seed demo data: users (admin/instructor/students), courses, editions and enrollments."

    def add_arguments(self, parser):
        parser.add_argument(
            "--with-archive",
            action="store_true",
            help="Archive the first edition to generate snapshot data.",
        )
        parser.add_argument(
            "--password",
            type=str,
            default="pass1234",
            help="Password to set for created demo users.",
        )

    def handle(self, *args, **options):
        password = options["password"]
        with_archive = options["with_archive"]

        User = get_user_model()

        # Users
        admin, created = User.objects.get_or_create(
            email="admin@example.com",
            defaults={
                "username": "admin",
                "first_name": "Admin",
                "last_name": "User",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password(password)
            admin.save()
        admin_p = admin.profile
        admin_p.role = UserProfile.ADMIN
        admin_p.can_edit_courses = True
        admin_p.can_grade = True
        admin_p.save()

        instructor, created = User.objects.get_or_create(
            email="instructor@example.com",
            defaults={
                "username": "instructor",
                "first_name": "Ada",
                "last_name": "Lovelace",
            },
        )
        if created:
            instructor.set_password(password)
            instructor.save()
        instr_p = instructor.profile
        instr_p.role = UserProfile.INSTRUCTOR_EDITOR
        instr_p.can_edit_courses = True
        instr_p.can_grade = True
        instr_p.save()

        student1, created = User.objects.get_or_create(
            email="student1@example.com",
            defaults={
                "username": "student1",
                "first_name": "Alan",
                "last_name": "Turing",
            },
        )
        if created:
            student1.set_password(password)
            student1.save()

        student2, created = User.objects.get_or_create(
            email="student2@example.com",
            defaults={
                "username": "student2",
                "first_name": "Grace",
                "last_name": "Hopper",
            },
        )
        if created:
            student2.set_password(password)
            student2.save()

        # Courses
        python_course, _ = Course.objects.get_or_create(
            title="Python Fundamentals",
            defaults={
                "description": "Curso introductorio de Python.",
                "summary": "Aprende lo básico de Python.",
            },
        )
        adv_course, _ = Course.objects.get_or_create(
            title="Advanced Python",
            defaults={
                "description": "Temas avanzados de Python.",
                "summary": "Profundiza en internals y patrones.",
                "level": Course.LEVEL_INTERMEDIATE,
            },
        )

        # Editions for Python Fundamentals
        today = timezone.now().date()
        ed1, _ = CourseEdition.objects.get_or_create(
            course=python_course,
            name="2025-I",
            defaults={
                "start_date": today,
                "end_date": today + timedelta(days=60),
                "is_active": True,
            },
        )
        ed1.instructors.add(instructor)

        ed2, _ = CourseEdition.objects.get_or_create(
            course=python_course,
            name="2025-II",
            defaults={
                "start_date": today + timedelta(days=90),
                "end_date": today + timedelta(days=150),
                "is_active": True,
            },
        )
        ed2.instructors.add(instructor)

        # Editions for Advanced Python
        adv_ed1, _ = CourseEdition.objects.get_or_create(
            course=adv_course,
            name="2025-I",
            defaults={
                "start_date": today + timedelta(days=30),
                "end_date": today + timedelta(days=120),
                "is_active": True,
            },
        )
        adv_ed1.instructors.add(instructor)

        # Enrollments in Python Fundamentals 2025-I
        Enrollment.objects.get_or_create(
            student=student1, edition=ed1, instructor=instructor
        )
        Enrollment.objects.get_or_create(
            student=student2, edition=ed1, instructor=instructor
        )

        if with_archive and not ed1.is_archived:
            ed1.archive(by_user=admin, notes="Edición cerrada para demostración.")

        self.stdout.write(self.style.SUCCESS("Seed demo completed."))
