from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.courses.models import CourseEdition, Enrollment
from apps.users.serializers.user_serializers import UserSummarySerializer

User = get_user_model()


class EnrollmentSerializer(serializers.ModelSerializer):
    """Read serializer for enrollments including student/instructor summaries."""

    student = UserSummarySerializer(read_only=True)
    instructor = UserSummarySerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "instructor",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments within a course edition."""

    student = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), help_text="ID of the student to enroll."
    )
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        help_text="ID of the instructor responsible for the student.",
    )

    class Meta:
        model = Enrollment
        fields = ["student", "instructor"]

    def validate(self, attrs):
        edition = self.context.get("edition")
        if not isinstance(edition, CourseEdition):
            raise serializers.ValidationError(
                {"edition": "Edition context is required to create an enrollment."}
            )

        instructor = attrs["instructor"]
        if not edition.instructors.filter(pk=instructor.pk).exists():
            raise serializers.ValidationError(
                {"instructor": "Instructor must be assigned to the edition."}
            )
        attrs["edition"] = edition
        return attrs

    def create(self, validated_data):
        return Enrollment.objects.create(**validated_data)
