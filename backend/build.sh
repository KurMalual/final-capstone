#!/usr/bin/env bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
