from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Hosts permitidos para desarrollo
ALLOWED_HOSTS = []

SECRET_KEY='admin123'
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
    "http://frontend:5173",
]

CORS_ALLOW_ALL_ORIGINS = True
SECURE_CROSS_ORIGIN_OPENER_POLICY = None  # Disable COOP for development

# Update your CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

ACCOUNT_EMAIL_VERIFICATION = "none"  

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "your-google-client-id.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "your-google-client-secret")

# Update the SOCIALACCOUNT_PROVIDERS setting with the correct client ID
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": GOOGLE_CLIENT_ID,
            "secret": GOOGLE_CLIENT_SECRET,
            "key": ""
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        }
    }
}

# Add this to your develop.py settings

# Add detailed logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'apps.users': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}