#!/bin/bash

echo "🚀 Deploying Smart Farm Advisory fixes..."
echo "============================================"

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this script from your backend directory."
    exit 1
fi

# Add all changes
git add .

# Commit changes
git commit -m "Fix CORS, authentication, and production settings"

echo "📦 1. Updating Django settings..."
# No changes needed here as git add . already includes settings.py

echo "🚀 2. Deploying to Heroku..."
echo "📤 Pushing to Heroku..."
git push heroku main

echo "⚙️ 3. Running migrations on Heroku..."
heroku run python manage.py migrate

echo "👤 4. Creating superuser (if needed)..."
heroku run python manage.py shell -c "
from users.models import User
if not User.objects.filter(email='admin@smartfarm.com').exists():
    User.objects.create_superuser('admin', 'admin@smartfarm.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"

echo "🔍 5. Testing deployment..."
python test_production_connection.py

echo "✅ Backend deployment complete!"
echo "🌐 Your backend URL: https://smart-farm-advisory-d46b4015b13a.herokuapp.com"
echo ""
echo "🌐 Next steps:"
echo "1. Deploy your frontend changes to Vercel"
echo "2. Test your live application"
echo "3. Check browser console for any errors"
