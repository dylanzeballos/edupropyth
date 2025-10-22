from django.conf import settings
from django.shortcuts import redirect


class SocialAuthRedirectMiddleware:
    """Redirect social auth to frontend"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # If it's a social auth callback, redirect to frontend
        if request.path.startswith("/accounts/") and response.status_code == 302:
            redirect_url = response.url
            if "dashboard" in redirect_url or "profile" in redirect_url:
                frontend_url = settings.FRONTEND_URL
                response = redirect(f"{frontend_url}{redirect_url}")

        return response
