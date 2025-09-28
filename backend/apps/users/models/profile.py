from typing import TYPE_CHECKING
from django.conf import settings
from django.db import models

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser


class UserProfile(models.Model):
    """Extensión del modelo de usuario para perfiles adicionales"""

    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (INSTRUCTOR, "Instructor"),
        (ADMIN, "Administrator"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile", verbose_name="User"
    )
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default=STUDENT, verbose_name="Role"
    )
    student_id = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Student ID"
    )
    enrollment_date = models.DateField(
        auto_now_add=True, verbose_name="Enrollment date"
    )
    github_username = models.CharField(
        max_length=100, blank=True, verbose_name="GitHub username"
    )
    linkedin_profile = models.URLField(blank=True, verbose_name="LinkedIn profile")

    class Meta:
        db_table = "user_profiles"
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        full_name = (
            self.user.get_full_name()
            if self.user.get_full_name()
            else self.user.username
        )
        return f"{full_name} - {self.get_role_display()}"

    @property
    def is_student(self):
        return self.role == self.STUDENT

    @property
    def is_instructor(self):
        return self.role == self.INSTRUCTOR

    @property
    def is_admin(self):
        return self.role == self.ADMIN
