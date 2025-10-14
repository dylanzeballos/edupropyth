from django.contrib import admin

from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "instructors_list",
        "level",
        "is_active",
        "start_date",
        "end_date",
    )
    list_filter = ("level", "is_active")
    search_fields = ("title", "description", "instructors__email")
    prepopulated_fields = {"slug": ("title",)}

    def instructors_list(self, obj):
        return ", ".join(
            [u.get_full_name() or u.email or u.username for u in obj.instructors.all()]
        )
    instructors_list.short_description = "Instructors"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "instructor", "created_at")
    list_filter = ("course",)
    search_fields = (
        "student__email",
        "student__username",
        "instructor__email",
        "instructor__username",
        "course__title",
    )
