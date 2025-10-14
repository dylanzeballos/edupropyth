from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class Course(models.Model):
    """Course available on the platform."""

    LEVEL_BEGINNER = "beginner"
    LEVEL_INTERMEDIATE = "intermediate"
    LEVEL_ADVANCED = "advanced"

    LEVEL_CHOICES = [
        (LEVEL_BEGINNER, "Beginner"),
        (LEVEL_INTERMEDIATE, "Intermediate"),
        (LEVEL_ADVANCED, "Advanced"),
    ]

    title = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True, max_length=160)
    description = models.TextField(help_text="Short overview of what the course covers.")
    summary = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional concise summary shown in listings.",
    )
    level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, default=LEVEL_BEGINNER
    )
    instructors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="courses_taught",
        help_text="Teachers who can impart this course.",
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    enrollment_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum number of students allowed. Leave empty for no limit.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses"
        ordering = ["title"]
        verbose_name = "Course"
        verbose_name_plural = "Courses"

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Enrollment(models.Model):
    """Link a student to a course with an assigned instructor."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    course = models.ForeignKey(
        Course,
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
                fields=["student", "course"], name="uniq_student_course_enrollment"
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} in {self.course} with {self.instructor}"

    def clean(self):
        # Ensure the instructor is part of the course's instructors set
        if self.instructor_id and self.course_id:
            if not self.course.instructors.filter(pk=self.instructor_id).exists():
                raise ValidationError(
                    {"instructor": "Instructor must be assigned to the course."}
                )
