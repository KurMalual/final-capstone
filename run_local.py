#!/usr/bin/env python
"""Run Django with local settings."""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_farm.settings_local')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Default to runserver if no command provided
    if len(sys.argv) == 1:
        sys.argv.append('runserver')
    
    execute_from_command_line(sys.argv)
