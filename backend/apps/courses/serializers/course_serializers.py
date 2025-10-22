from rest_framework import serializers

from apps.courses.models import Course, CourseEdition


class CourseEditionSummarySerializer(serializers.ModelSerializer):
    """Small representation used inside course detail responses."""

    class Meta:
        model = CourseEdition
        fields = [
            "id",
            "name",
            "slug",
            "start_date",
            "end_date",
            "is_active",
            "is_archived",
        ]
        read_only_fields = fields


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer for listing courses with aggregate information."""

    active_editions = serializers.SerializerMethodField()
    archived_editions = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "level",
            "is_active",
            "created_at",
            "updated_at",
            "active_editions",
            "archived_editions",
        ]
        read_only_fields = fields

    def get_active_editions(self, obj):
        return obj.editions.filter(is_archived=False).count()

    def get_archived_editions(self, obj):
        return obj.editions.filter(is_archived=True).count()


class CourseDetailSerializer(CourseListSerializer):
    """Detailed serializer for a course."""

    description = serializers.CharField()
    latest_editions = CourseEditionSummarySerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + [
            "description",
            "latest_editions",
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include only the most recent 3 editions for a concise overview.
        if "latest_editions" in representation:
            queryset = instance.editions.order_by("-start_date", "-created_at")[:3]
            representation["latest_editions"] = CourseEditionSummarySerializer(
                queryset, many=True
            ).data
        return representation


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer used for course creation and updates."""

    class Meta:
        model = Course
        fields = [
            "title",
            "description",
            "summary",
            "level",
            "is_active",
        ]
        read_only_fields = ["is_active"]

    def validate_level(self, value):
        valid_levels = {choice[0] for choice in Course.LEVEL_CHOICES}
        if value not in valid_levels:
            raise serializers.ValidationError(
                f"Level must be one of: {', '.join(sorted(valid_levels))}"
            )
        return value
