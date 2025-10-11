from django.conf import settings
from django.db import models
from django.utils import timezone

class UserProfile(models.Model):
    """Extensión del modelo de usuario para perfiles adicionales"""

    STUDENT = "student"
    INSTRUCTOR_VIEWER = "instructor_viewer"
    INSTRUCTOR_EDITOR = "instructor_editor"
    ADMIN = "admin"

    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (INSTRUCTOR_VIEWER, "Instructor(Viewer)"),
        (INSTRUCTOR_EDITOR, "Instructor(Editor)"),
        (ADMIN, "Administrator"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="User"
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=STUDENT,
        verbose_name="Role"
    )

    instructor_permissions_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Instructor permissions valid until"
    )

    can_grade = models.BooleanField(default=False, verbose_name="Can grade assignments")
    can_edit_courses = models.BooleanField(default=False, verbose_name="Can edit courses")
    can_create_courses = models.BooleanField(default=False, verbose_name="Can create courses")
    can_delete_submissions = models.BooleanField(default=False, verbose_name="Can delete submissions")

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
        return self.role in [self.INSTRUCTOR_VIEWER, self.INSTRUCTOR_EDITOR]
    
    @property
    def has_valid_instructor_permissions(self):
        if not self.is_instructor:
            return False
        if self.instructor_permissions_until is None:
            return True
        return timezone.now() < self.instructor_permissions_until

    @property
    def is_admin(self):
        return self.role == self.ADMIN
