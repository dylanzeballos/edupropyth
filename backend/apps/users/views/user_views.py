from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from django.contrib.auth import get_user_model

from ..serializers.user_serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserSummarySerializer,
)
from ..services.user_service import UserService

User = get_user_model()


class UserListCreateView(generics.ListCreateAPIView):
    """List all users or create a new user"""

    queryset = User.objects.select_related("profile").all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserCreateSerializer
        return UserSummarySerializer

    def get_permissions(self):
        """Allow registration without authentication"""
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # The role handling is now done in the serializer
        serializer.save()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a user"""

    queryset = User.objects.select_related("profile").all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """Only allow users to edit their own profile or admins"""
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request, user_id):
    """Get comprehensive user statistics"""
    try:
        stats = UserService.get_user_stats(user_id)
        return Response(stats)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Get current authenticated user details"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
