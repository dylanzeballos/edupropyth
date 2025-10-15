from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Enrollment(models.Model):
    """Link a student to a course edition with an assigned instructor."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    edition = models.ForeignKey(
        "courses.CourseEdition",
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assigned_students",
        help_text="Instructor responsible for this student's track in the course.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "course_enrollments"
        verbose_name = "Enrollment"
        verbose_name_plural = "Enrollments"
        constraints = [
            models.UniqueConstraint(
                fields=["student", "edition"], name="uniq_student_edition_enrollment"
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} in {self.edition} with {self.instructor}"

    def clean(self):
        # Ensure the instructor is part of the edition's instructors set
        if self.instructor_id and self.edition_id:
            if not self.edition.instructors.filter(pk=self.instructor_id).exists():
                raise ValidationError(
                    {"instructor": "Instructor must be assigned to the edition."}
                )
