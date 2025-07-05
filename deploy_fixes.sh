#!/bin/bash

echo "🚀 Deploying Smart Farm Advisory fixes to Heroku..."
echo "=============================================="

# Add all changes
git add .

# Commit changes
git commit -m "Fix CORS settings and authentication for production deployment"

# Push to Heroku
echo "📤 Pushing to Heroku..."
git push heroku main

echo "✅ Deployment complete!"
echo ""
echo "🔍 Checking deployment status..."
heroku ps:scale web=1
heroku logs --tail --num=50

echo ""
echo "🌐 Your backend is now live at:"
echo "https://smart-farm-advisory-d46b4015b13a.herokuapp.com"
