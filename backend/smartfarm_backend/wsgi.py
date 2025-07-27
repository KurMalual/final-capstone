import os
import sys
from pathlib import Path

# Add both backend and project root to Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR.parent))

# Debugging: Print sys.path to verify paths
print("sys.path:", sys.path)

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartfarm_backend.settings')
application = get_wsgi_application()