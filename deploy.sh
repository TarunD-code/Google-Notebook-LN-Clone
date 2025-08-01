#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Check if build was successful
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build folder created at: frontend/build"
    echo ""
    echo "🌐 To deploy:"
    echo "1. Frontend (Netlify): Upload frontend/build folder"
    echo "2. Backend (Render): Connect repository and set start command to 'cd backend && npm start'"
    echo ""
    echo "📋 Environment variables needed:"
    echo "Backend: PORT, OPENAI_API_KEY, NODE_ENV"
    echo "Frontend: REACT_APP_API_URL (your backend URL)"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Deployment preparation complete!"