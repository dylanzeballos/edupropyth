import os
import tempfile

from .base import *

# Test environment settings
DEBUG = False
SECRET_KEY = "test-secret-key-for-testing-only"

# Test database configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "OPTIONS": {
            "timeout": 20,
        },
    }
}

# Speed up password hashing in tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]


# Disable migrations for faster test runs
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


MIGRATION_MODULES = DisableMigrations()

# Email backend for testing
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Media files
MEDIA_ROOT = tempfile.mkdtemp()
STATIC_ROOT = tempfile.mkdtemp()

# Cache configuration for tests
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Logging configuration for tests
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}

# OAuth settings for testing (fake values)
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": "fake-google-client-id-for-testing",
            "secret": "fake-google-secret-for-testing",
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    },
    "github": {
        "APP": {
            "client_id": "fake-github-client-id-for-testing",
            "secret": "fake-github-secret-for-testing",
            "key": "",
        },
        "AUTH_PARAMS": {
            "prompt": "consent",
        },
    },
    "microsoft": {
        "APP": {
            "client_id": "fake-microsoft-client-id-for-testing",
            "secret": "fake-microsoft-secret-for-testing",
            "key": "",
        },
        "SCOPE": [
            "User.Read",
            "Mail.Read",
        ],
    },
}

# Celery settings for testing
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Security settings relaxed for testing
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

# Disable unnecessary features for tests
USE_TZ = True

# Test runner settings
TEST_RUNNER = "django.test.runner.DiscoverRunner"
