import os

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Hosts permitidos para desarrollo
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

SECRET_KEY = "admin123"
# Database - Local para desarrollo
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.getenv("DB_NAME", "edupropyth"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "OPTIONS": {"sslmode": "disable"},
    }
}

# CORS settings para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = True
FRONTEND_URL = "http://localhost:5173"

# Django All-Auth settings
ACCOUNT_EMAIL_VERIFICATION = "optional"  # o "mandatory"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_USERNAME_REQUIRED = False

# Redirect after social login
LOGIN_REDIRECT_URL = f"{FRONTEND_URL}/dashboard"
ACCOUNT_LOGOUT_REDIRECT_URL = f"{FRONTEND_URL}/auth/login"

# Social Auth providers
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "REDIRECT_URI": "http://localhost:8000/accounts/google/login/callback/",
    },
    "github": {
        "SCOPE": [
            "user",
            "user:email",
        ],
        "REDIRECT_URI": "http://localhost:8000/accounts/github/login/callback/",
    },
}
