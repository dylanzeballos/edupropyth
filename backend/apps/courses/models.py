from django.conf import settings
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
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
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
