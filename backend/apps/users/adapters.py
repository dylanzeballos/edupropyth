from allauth.account.utils import user_email, user_field, user_username
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialApp

from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site

from .services.user_service import UserService

User = get_user_model()


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        user = sociallogin.user
        if sociallogin.is_existing:
            return
        try:
            existing_user = User.objects.get(email=user.email)
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            pass

    def get_app(self, request, provider, client_id=None):
        try:
            return super().get_app(request, provider, client_id)
        except Exception:
            site = get_current_site(request)
            apps = SocialApp.objects.filter(sites__id=site.id, provider=provider)
            if apps.exists():
                return apps.first()
            raise

    def save_user(self, request, sociallogin, form=None):
        user = sociallogin.user
        user.set_unusable_password()

        if sociallogin.account.provider == "google":
            extra_data = sociallogin.account.extra_data
            user_field(user, "first_name", extra_data.get("given_name", ""))
            user_field(user, "last_name", extra_data.get("family_name", ""))
            user_email(user, extra_data.get("email"))
            user_username(user, extra_data.get("email").split("@")[0])

        user.save()

        UserService.create_user_profile(user, role="student")

        return user
