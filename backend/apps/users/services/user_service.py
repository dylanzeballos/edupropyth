from django.contrib.auth import get_user_model
from django.db import transaction

from ..models.profile import UserProfile

User = get_user_model()


class UserService:
    """Service class for user-related business logic"""

    @staticmethod
    @transaction.atomic
    def create_user_profile(user, role="student"):
        """Create user profile after user creation"""
        profile, created = UserProfile.objects.get_or_create(
            user=user, defaults={"role": role}
        )
        return profile

    @staticmethod
    def get_user_stats(user_id):
        """Get comprehensive user statistics"""
        try:
            user = User.objects.select_related("profile").get(id=user_id)
        except User.DoesNotExist:
            raise User.DoesNotExist("User not found")

        # Basic user stats - to be expanded when courses are implemented
        stats = {
            "user_id": user.id,
            "full_name": user.get_full_name(),
            "email": user.email,
            "role": user.profile.role if hasattr(user, "profile") else "student",
            "enrollment_date": (
                user.profile.enrollment_date
                if hasattr(user, "profile")
                else user.date_joined
            ),
            "is_active": user.is_active,
            # Placeholder for future course-related stats
            "enrollments_count": 0,
            "completed_courses": 0,
            "submissions_count": 0,
            "success_rate": 0.0,
        }

        return stats

    @staticmethod
    @transaction.atomic
    def update_user_role(user_id, new_role):
        """Update user role with transaction safety"""
        try:
            profile = UserProfile.objects.select_for_update().get(user_id=user_id)
            profile.role = new_role
            profile.save()
            return True
        except UserProfile.DoesNotExist:
            return False

    @staticmethod
    def get_instructors():
        """Get all users with instructor role"""
        return User.objects.filter(profile__role="instructor").select_related("profile")

    @staticmethod
    def get_students():
        """Get all users with student role"""
        return User.objects.filter(profile__role="student").select_related("profile")

    @staticmethod
    def get_admins():
        """Get all users with admin role"""
        return User.objects.filter(profile__role="admin").select_related("profile")
