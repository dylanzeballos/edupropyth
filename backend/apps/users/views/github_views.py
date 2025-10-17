import logging

import requests
from environ import Env
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

env = Env()
env.read_env()

logger = logging.getLogger(__name__)
User = get_user_model()


class GitHubAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code")

        if not code:
            return Response(
                {"error": "Authorization code is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Exchange code for access token
            token_response = requests.post(
                "https://github.com/login/oauth/access_token",
                {
                    "client_id": env("GITHUB_CLIENT_ID"),
                    "client_secret": env("GITHUB_CLIENT_SECRET"),
                    "code": code,
                },
                headers={"Accept": "application/json"},
            )

            if token_response.status_code != 200:
                return Response(
                    {"error": "Failed to get access token"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            token_data = token_response.json()
            access_token = token_data.get("access_token")

            if not access_token:
                return Response(
                    {"error": "No access token received"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Get user data from GitHub
            user_response = requests.get(
                "https://api.github.com/user",
                headers={"Authorization": f"token {access_token}"},
            )

            if user_response.status_code != 200:
                return Response(
                    {"error": "Failed to get user data"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            github_data = user_response.json()

            # Get user email (GitHub might not provide public email)
            email_response = requests.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"token {access_token}"},
            )

            email = None
            if email_response.status_code == 200:
                emails = email_response.json()
                primary_email = next((e for e in emails if e["primary"]), None)
                if primary_email:
                    email = primary_email["email"]

            # Fallback to public email or create one
            if not email:
                email = github_data.get("email")
            if not email:
                email = f"{github_data['login']}@github.local"

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=email,
                    username=github_data["login"],
                    first_name=(
                        github_data.get("name", "").split(" ")[0]
                        if github_data.get("name")
                        else ""
                    ),
                    last_name=(
                        " ".join(github_data.get("name", "").split(" ")[1:])
                        if github_data.get("name")
                        and len(github_data.get("name", "").split(" ")) > 1
                        else ""
                    ),
                    is_active=True,
                )

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "full_name": f"{user.first_name} {user.last_name}".strip(),
                    },
                }
            )

        except Exception as e:
            logger.exception("Error in GitHub authentication")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["POST"])
@permission_classes([AllowAny])
def github_auth(request):
    """Function-based view for GitHub authentication (if needed for compatibility)"""
    view = GitHubAuthView()
    return view.post(request)
