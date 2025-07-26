#!/usr/bin/env bash
set -e

# Upgrade pip and dependencies
pip install --upgrade pip setuptools wheel

# Install project dependencies
pip install -r requirements.txt

# Apply database migrations
python backend/manage.py migrate

# Collect static files
python backend/manage.py collectstatic --noinput
