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


class MicrosoftAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code")

        if not code:
            logger.error("No authorization code provided")
            return Response(
                {"error": "Authorization code is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Intercambiar code por access token
            token_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
            token_data = {
                "client_id": env("MICROSOFT_CLIENT_ID"),
                "client_secret": env("MICROSOFT_CLIENT_SECRET"),
                "code": code,
                "redirect_uri": "http://localhost:5173/auth/microsoft/callback",
                "grant_type": "authorization_code",
            }

            logger.info(
                f"Attempting to exchange code for token with client_id: {env('MICROSOFT_CLIENT_ID')}"
            )

            token_response = requests.post(token_url, data=token_data)

            if token_response.status_code != 200:
                logger.error(
                    f"Microsoft token error: {token_response.status_code} - {token_response.text}"
                )
                return Response(
                    {
                        "error": "Failed to exchange code for token",
                        "details": token_response.text,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token_json = token_response.json()
            access_token = token_json.get("access_token")

            if not access_token:
                logger.error(f"No access token in response: {token_json}")
                return Response(
                    {"error": "No access token received"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            logger.info("Successfully obtained access token from Microsoft")

            # Obtener información del usuario
            user_response = requests.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if user_response.status_code != 200:
                logger.error(
                    f"Microsoft user info error: {user_response.status_code} - {user_response.text}"
                )
                return Response(
                    {"error": "Failed to get user information"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_data = user_response.json()
            logger.info(
                f"Retrieved user data from Microsoft: {user_data.get('userPrincipalName')}"
            )

            email = user_data.get("mail") or user_data.get("userPrincipalName")

            if not email:
                logger.error("No email found in Microsoft user data")
                return Response(
                    {"error": "Email not provided by Microsoft"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Crear o obtener usuario
            try:
                user = User.objects.get(email=email)
                logger.info(f"Existing user found: {user.email}")
            except User.DoesNotExist:
                given_name = user_data.get("givenName", "")
                surname = user_data.get("surname", "")
                display_name = user_data.get("displayName", "")

                # Si no hay givenName/surname, intentar separar displayName
                if not given_name and display_name:
                    name_parts = display_name.split(" ")
                    given_name = name_parts[0] if name_parts else ""
                    surname = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

                user = User.objects.create(
                    email=email,
                    username=email.split("@")[0],
                    first_name=given_name,
                    last_name=surname,
                    is_active=True,
                )
                logger.info(f"New user created: {user.email}")

            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)

            response_data = {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "full_name": f"{user.first_name} {user.last_name}".strip()
                    or user.username,
                    "profile_role": (
                        getattr(user.profile, "role", "student")
                        if hasattr(user, "profile")
                        else "student"
                    ),
                },
            }

            logger.info(f"Successful Microsoft login for: {user.email}")
            return Response(response_data)

        except Exception as e:
            logger.exception("Error in Microsoft authentication")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
@permission_classes([AllowAny])
def microsoft_callback(request):
    """Handle Microsoft OAuth callback - this is a fallback if needed"""
    code = request.GET.get("code")
    error = request.GET.get("error")

    if error:
        logger.error(f"Microsoft OAuth error: {error}")
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

    if code:
        # Redirect to frontend with code
        from django.shortcuts import redirect

        frontend_url = "http://localhost:5173/auth/microsoft/callback"
        return redirect(f"{frontend_url}?code={code}")

    return Response(
        {"error": "No code or error provided"}, status=status.HTTP_400_BAD_REQUEST
    )
