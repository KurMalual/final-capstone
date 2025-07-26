"""
WSGI config for smartfarm_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# Print the PYTHONPATH and sys.path for debugging
print("PYTHONPATH:", sys.path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartfarm_backend.settings")

application = get_wsgi_application()
