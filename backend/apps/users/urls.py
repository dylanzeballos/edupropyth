from django.urls import path, include
from .views.auth_views import GoogleLogin, google_auth
from .views.google_views import GoogleAuthView

try:
    from .views.user_views import (
        UserListCreateView,
        UserDetailView,
        user_stats,
        current_user,
    )
    from .views.profile_views import UserProfileDetailView, update_role
except ImportError:
    from django.http import JsonResponse
    from rest_framework.decorators import api_view

    @api_view(["GET"])
    def placeholder_view(request):
        return JsonResponse({"error": "Views not configured yet"})

    UserListCreateView = placeholder_view
    UserDetailView = placeholder_view
    user_stats = placeholder_view
    current_user = placeholder_view
    UserProfileDetailView = placeholder_view
    update_role = placeholder_view

app_name = "users"

user_patterns = [
    path("", UserListCreateView.as_view(), name="user-list-create"),
    path("me/", current_user, name="current-user"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("<int:user_id>/stats/", user_stats, name="user-stats"),
]

urlpatterns = user_patterns + [
    path("profiles/<int:user_id>/", UserProfileDetailView.as_view(), name="profile-detail"),
    path("profiles/<int:user_id>/role/", update_role, name="update-role"),
    path("auth/google/", GoogleLogin.as_view(), name="google-oauth-login"),
    path("auth/google-login/", GoogleAuthView.as_view(), name="google-login"),
    path("auth/google/callback/", google_auth, name="google-oauth"),
]
