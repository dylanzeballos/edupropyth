from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..models.profile import UserProfile


class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update user profile"""

    queryset = UserProfile.objects.select_related("user").all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "user_id"

    def get_serializer_class(self):
        from apps.users.serializers.profile_serializers import (
            UserProfileSerializer,
            UserProfileUpdateSerializer,
        )

        if self.request.method in ["PUT", "PATCH"]:
            return UserProfileUpdateSerializer
        return UserProfileSerializer


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def update_role(request, user_id):
    """Update user role (admin only)"""
    # Check if user is admin
    if not hasattr(request.user, "profile") or request.user.profile.role != "admin":
        return Response(
            {"error": "Permission denied. Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    new_role = request.data.get("role")
    if new_role not in ["student", "instructor", "admin"]:
        return Response(
            {"error": "Invalid role. Must be: student, instructor, or admin"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        profile = UserProfile.objects.get(user_id=user_id)
        profile.role = new_role
        profile.save()
        return Response({"message": f"Role updated to {new_role} successfully"})
    except UserProfile.DoesNotExist:
        return Response(
            {"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND
        )
