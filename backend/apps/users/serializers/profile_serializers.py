from rest_framework import serializers

from ..models.profile import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data"""

    user_email = serializers.CharField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "user_email",
            "user_full_name",
            "role",
            "role_display",
            "student_id",
            "enrollment_date",
            "github_username",
            "linkedin_profile",
        ]
        read_only_fields = ["enrollment_date"]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""

    class Meta:
        model = UserProfile
        fields = ["student_id", "github_username", "linkedin_profile"]
