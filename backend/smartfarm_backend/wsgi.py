"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

# Debugging: Print environment variables (optional)
print("PYTHONPATH:", os.environ.get("PYTHONPATH"))
print("DJANGO_SETTINGS_MODULE:", os.environ.get("DJANGO_SETTINGS_MODULE"))

from django.core.wsgi import get_wsgi_application

# Make sure this matches your project structure!
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.smartfarm_backend.settings')

application = get_wsgi_application()
