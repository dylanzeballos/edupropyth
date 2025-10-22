from django.contrib import admin

from .models import Course, CourseEdition, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "level",
        "is_active",
        "active_editions_count",
        "archived_editions_count",
        "created_at",
    )
    list_filter = ("level", "is_active")
    search_fields = (
        "title",
        "description",
        "editions__name",
        "editions__slug",
        "editions__instructors__email",
    )
    prepopulated_fields = {"slug": ("title",)}

    def active_editions_count(self, obj):
        return obj.editions.filter(is_archived=False).count()

    active_editions_count.short_description = "Active editions"

    def archived_editions_count(self, obj):
        return obj.editions.filter(is_archived=True).count()

    archived_editions_count.short_description = "Archived editions"


@admin.register(CourseEdition)
class CourseEditionAdmin(admin.ModelAdmin):
    list_display = (
        "course",
        "name",
        "slug",
        "start_date",
        "end_date",
        "is_active",
        "is_archived",
    )
    list_filter = ("course", "is_active", "is_archived")
    search_fields = (
        "course__title",
        "name",
        "slug",
        "instructors__email",
        "instructors__username",
    )
    autocomplete_fields = ("course", "instructors")
    readonly_fields = ("archived_at", "archived_by", "archive_snapshot")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "edition", "instructor", "created_at")
    list_filter = ("edition__course", "edition")
    search_fields = (
        "student__email",
        "student__username",
        "instructor__email",
        "instructor__username",
        "edition__course__title",
        "edition__name",
    )
    autocomplete_fields = ("edition", "student", "instructor")
