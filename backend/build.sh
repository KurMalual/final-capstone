#!/usr/bin/env bash
set -e  # Exit immediately if any command fails

pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Debugging: Print PYTHONPATH
echo "PYTHONPATH: $PYTHONPATH"

# Apply database migrations
python manage.py migrate

# Collect static files without input
python manage.py collectstatic --noinput
