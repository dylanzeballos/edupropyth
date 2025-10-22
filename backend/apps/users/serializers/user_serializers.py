from rest_framework import serializers

from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user creation"""

    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False, default="student")

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
            "bio",
            "role",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError("Passwords don't match")

        # Validate role
        valid_roles = ["student", "instructor"]
        role = attrs.get("role", "student")
        if role not in valid_roles:
            raise serializers.ValidationError(
                f"Role must be one of: {', '.join(valid_roles)}"
            )

        return attrs

    def create(self, validated_data):
        role = validated_data.pop("role", "student")
        validated_data.pop("password_confirm")
        user = User.objects.create_user(**validated_data)

        # Create profile with the specified role
        from ..services.user_service import UserService

        UserService.create_user_profile(user, role=role)

        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""

    full_name = serializers.CharField(source="get_full_name", read_only=True)
    profile_role = serializers.CharField(source="profile.role", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "bio",
            "avatar",
            "is_active",
            "created_at",
            "profile_role",
        ]
        read_only_fields = ["created_at"]


class UserSummarySerializer(serializers.ModelSerializer):
    """Lightweight user serializer for lists and references"""

    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "avatar"]
