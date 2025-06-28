#!/bin/bash

echo "🚀 Building React frontend..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build the React app
echo "🔨 Building React app..."
npm run build

# Go back to backend directory
cd ..

echo "✅ Frontend build complete!"
echo "📁 Build files are in frontend/build/"
echo "🌐 Django will serve these files in production"
