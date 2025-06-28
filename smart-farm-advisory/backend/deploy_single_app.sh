#!/bin/bash

echo "🚀 Deploying Smart Farm Advisory as Single App to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
echo "🔐 Logging into Heroku..."
heroku login

# Get app name from user
APP_NAME="smart-farm-advisory-$(date +%s)"
echo "📱 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Set buildpacks for Node.js and Python
echo "🔧 Setting up buildpacks..."
heroku buildpacks:clear -a $APP_NAME
heroku buildpacks:add --index 1 heroku/nodejs -a $APP_NAME
heroku buildpacks:add --index 2 heroku/python -a $APP_NAME

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini -a $APP_NAME

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set DEBUG=False -a $APP_NAME
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
heroku config:set SECRET_KEY="$SECRET_KEY" -a $APP_NAME
heroku config:set HEROKU_APP_NAME=$APP_NAME -a $APP_NAME

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git init
git add .
git commit -m "Deploy Smart Farm Advisory single app"
git push heroku main

# Run migrations
echo "🔄 Running database migrations..."
heroku run python manage.py migrate -a $APP_NAME

# Create superuser (optional)
echo "👤 Creating superuser..."
heroku run python manage.py createsuperuser -a $APP_NAME

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://$APP_NAME.herokuapp.com"
echo "🔧 Admin panel: https://$APP_NAME.herokuapp.com/admin"
