from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
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
    description = models.TextField(
        help_text="Short overview of what the course covers."
    )
    summary = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional concise summary shown in listings.",
    )
    level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, default=LEVEL_BEGINNER
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


class CourseEdition(models.Model):
    """Cohort/edition of a course for a given academic period."""

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="editions",
    )
    name = models.CharField(
        max_length=120,
        help_text="Display name for the edition (e.g., '2025-I', 'Spring 2025').",
    )
    slug = models.SlugField(
        max_length=180,
        help_text="Unique identifier for the edition.",
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    enrollment_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum number of students allowed. Leave empty for no limit.",
    )
    instructors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="course_editions_taught",
        help_text="Teachers who can impart this course edition.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="If disabled, students cannot enroll or progress.",
    )
    is_archived = models.BooleanField(
        default=False,
        help_text="Archived editions are read-only and historical.",
    )
    archived_at = models.DateTimeField(null=True, blank=True)
    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="archived_editions",
    )
    archive_snapshot = models.JSONField(
        default=dict,
        blank=True,
        help_text="Stored data about participants and progress at archive time.",
    )
    archive_notes = models.TextField(
        blank=True,
        help_text="Optional notes about the archive (e.g., reasons, summary).",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "course_editions"
        verbose_name = "Course Edition"
        verbose_name_plural = "Course Editions"
        unique_together = ("course", "slug")
        ordering = ["-start_date", "-created_at"]

    def __str__(self) -> str:
        return f"{self.course.title} - {self.name}"

    def clean(self):
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError(
                {"end_date": "End date must be greater than or equal to start date."}
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            base = f"{self.course.slug}-{self.name}"
            self.slug = slugify(base)
        super().save(*args, **kwargs)

    def build_archive_snapshot(self):
        """Create a dictionary with key information about this edition."""
        instructors = [
            {
                "id": instructor.id,
                "full_name": instructor.get_full_name(),
                "email": instructor.email,
            }
            for instructor in self.instructors.all()
        ]
        students = [
            {
                "id": enrollment.student_id,
                "full_name": enrollment.student.get_full_name(),
                "email": enrollment.student.email,
                "instructor_id": enrollment.instructor_id,
            }
            for enrollment in self.enrollments.select_related(
                "student", "instructor"
            ).all()
        ]
        return {
            "course": {"id": self.course_id, "title": self.course.title},
            "edition": {
                "id": self.id,
                "name": self.name,
                "start_date": self.start_date.isoformat() if self.start_date else None,
                "end_date": self.end_date.isoformat() if self.end_date else None,
            },
            "instructors": instructors,
            "students": students,
            "generated_at": timezone.now().isoformat(),
        }

    def archive(self, by_user, notes=None, snapshot=None):
        """Archive the edition, freezing current state data."""
        if self.is_archived:
            raise ValidationError("Edition is already archived.")
        if snapshot is None:
            snapshot = self.build_archive_snapshot()
        self.is_archived = True
        self.is_active = False
        self.archived_at = timezone.now()
        self.archived_by = by_user
        self.archive_snapshot = snapshot
        if notes is not None:
            self.archive_notes = notes
        self.save(
            update_fields=[
                "is_archived",
                "is_active",
                "archived_at",
                "archived_by",
                "archive_snapshot",
                "archive_notes",
            ]
        )
