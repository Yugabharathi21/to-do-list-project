#!/bin/bash

# Production Deployment Script for SPiceZ
# Run this script to deploy to production

echo "🚀 Starting production deployment process..."

# 1. Make sure we are on the production branch
echo "📋 Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "production" ]; then
    echo "❌ You are not on the production branch. Current branch: $CURRENT_BRANCH"
    echo "✅ Switching to production branch..."
    git checkout production || { echo "Failed to switch to production branch"; exit 1; }
fi

# 2. Pull latest changes
echo "📥 Pulling latest changes from production branch..."
git pull origin production

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Build the application
echo "🔨 Building application for production..."
npm run build

# 5. Run tests if they exist
if grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# 6. Verify environment variables
echo "🔍 Verifying environment variables..."
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    exit 1
fi

if grep -q "VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api" .env.production; then
    echo "✅ API URL is correctly set"
else
    echo "❌ API URL is not correctly set in .env.production!"
    exit 1
fi

# 7. Ready for deployment
echo "✨ Build completed successfully!"
echo "🚀 Deploy to Vercel by pushing to the production branch:"
echo "   git push origin production"
echo ""
echo "⚠️ Make sure your Vercel project is configured to deploy from the production branch"
