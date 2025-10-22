from rest_framework import serializers

from django.contrib.auth import get_user_model

from apps.courses.models import Course, CourseEdition
from apps.users.serializers.user_serializers import UserSummarySerializer

User = get_user_model()


class CourseEditionListSerializer(serializers.ModelSerializer):
    """Serializer for listing course editions."""

    instructors = UserSummarySerializer(many=True, read_only=True)

    class Meta:
        model = CourseEdition
        fields = [
            "id",
            "course",
            "name",
            "slug",
            "start_date",
            "end_date",
            "enrollment_limit",
            "is_active",
            "is_archived",
            "instructors",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "slug",
            "is_archived",
            "created_at",
            "updated_at",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["course"] = instance.course.slug
        return representation


class CourseEditionDetailSerializer(CourseEditionListSerializer):
    """Detailed serializer including archival metadata."""

    archived_by = UserSummarySerializer(read_only=True)

    class Meta(CourseEditionListSerializer.Meta):
        fields = CourseEditionListSerializer.Meta.fields + [
            "archive_snapshot",
            "archive_notes",
            "archived_at",
            "archived_by",
        ]
        read_only_fields = CourseEditionListSerializer.Meta.read_only_fields + [
            "archive_snapshot",
            "archive_notes",
            "archived_at",
            "archived_by",
        ]


class CourseEditionWriteSerializer(serializers.ModelSerializer):
    """Serializer used for creating/updating course editions."""

    instructors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False,
        help_text="IDs of instructors assigned to this edition.",
    )

    class Meta:
        model = CourseEdition
        fields = [
            "name",
            "slug",
            "start_date",
            "end_date",
            "enrollment_limit",
            "instructors",
            "is_active",
        ]
        read_only_fields = ["slug"]

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be greater than or equal to start date."}
            )
        return attrs

    def create(self, validated_data):
        instructors = validated_data.pop("instructors", [])
        course = self.context.get("course")
        if not isinstance(course, Course):
            raise serializers.ValidationError(
                {"course": "Course context is required to create an edition."}
            )
        edition = CourseEdition.objects.create(course=course, **validated_data)
        if instructors:
            edition.instructors.set(instructors)
        return edition

    def update(self, instance, validated_data):
        instructors = validated_data.pop("instructors", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if instructors is not None:
            instance.instructors.set(instructors)
        return instance
