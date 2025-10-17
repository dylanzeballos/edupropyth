import logging

import requests
from environ import Env
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

env = Env()
env.read_env()

logger = logging.getLogger(__name__)
User = get_user_model()


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get("id_token")

        if not id_token:
            return Response(
                {"error": "ID token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            google_response = requests.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            )

            if google_response.status_code != 200:
                return Response(
                    {"error": "Invalid token", "details": google_response.text},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            google_data = google_response.json()

            token_aud = google_data.get("aud")
            our_client_id = env("GOOGLE_CLIENT_ID")

            if token_aud != our_client_id:
                return Response(
                    {"error": "Token not issued for this application"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            email = google_data.get("email")
            if not email:
                return Response(
                    {"error": "Email not provided by Google"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                first_name = google_data.get("given_name", "")
                last_name = google_data.get("family_name", "")

                user = User.objects.create(
                    email=email,
                    username=email.split("@")[0],
                    first_name=first_name,
                    last_name=last_name,
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
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "full_name": f"{user.first_name} {user.last_name}".strip(),
                    },
                }
            )

        except Exception as e:
            logger.exception("Error in Google authentication")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
