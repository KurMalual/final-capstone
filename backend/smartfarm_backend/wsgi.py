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

# Debugging: Verify the ROOT_URLCONF and DJANGO_SETTINGS_MODULE values
print("ROOT_URLCONF:", os.getenv('DJANGO_SETTINGS_MODULE'))
print("BASE_DIR added to sys.path:", BASE_DIR)

application = get_wsgi_application()