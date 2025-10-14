from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "instructor",
        "level",
        "is_active",
        "start_date",
        "end_date",
    )
    list_filter = ("level", "is_active")
    search_fields = ("title", "description", "instructor__email")
    prepopulated_fields = {"slug": ("title",)}
