#!/bin/bash

echo "🔨 Building React frontend..."

# Navigate to frontend directory
cd ../frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build React app
echo "⚛️ Building React app..."
npm run build

# Copy build files to Django static directory
echo "📁 Copying build files to Django..."
mkdir -p ../backend/staticfiles
cp -r build/* ../backend/staticfiles/

echo "✅ React build completed!"
