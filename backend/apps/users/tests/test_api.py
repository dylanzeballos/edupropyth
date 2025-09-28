from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""

    def setUp(self):
        self.user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        self.user = User.objects.create_user(
            email="existing@example.com", username="existing", password="testpass123"
        )

    def test_create_user_endpoint(self):
        """Test user creation via API"""
        url = reverse("users:user-list-create")
        response = self.client.post(url, self.user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data["email"]).exists())

    def test_create_user_password_mismatch(self):
        """Test user creation with password mismatch"""
        self.user_data["password_confirm"] = "different_password"
        url = reverse("users:user-list-create")
        response = self.client.post(url, self.user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_list_authenticated(self):
        """Test getting user list (requires authentication)"""
        self.client.force_authenticate(user=self.user)
        url = reverse("users:user-list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_list_unauthenticated(self):
        """Test getting user list without authentication"""
        url = reverse("users:user-list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
