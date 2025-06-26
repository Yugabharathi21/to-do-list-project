# Production Deployment Script for SPiceZ
# Run this script to deploy to production

Write-Host "🚀 Starting production deployment process..." -ForegroundColor Cyan

# 1. Make sure we are on the production branch
Write-Host "📋 Checking current branch..." -ForegroundColor Cyan
$CurrentBranch = git branch --show-current

if ($CurrentBranch -ne "production") {
    Write-Host "❌ You are not on the production branch. Current branch: $CurrentBranch" -ForegroundColor Yellow
    Write-Host "✅ Switching to production branch..." -ForegroundColor Cyan
    git checkout production
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to switch to production branch" -ForegroundColor Red
        exit 1
    }
}

# 2. Pull latest changes
Write-Host "📥 Pulling latest changes from production branch..." -ForegroundColor Cyan
git pull origin production

# 3. Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# 4. Build the application
Write-Host "🔨 Building application for production..." -ForegroundColor Cyan
npm run build

# 5. Run tests if they exist
$PackageJson = Get-Content -Raw package.json | ConvertFrom-Json
if ($PackageJson.scripts.test) {
    Write-Host "🧪 Running tests..." -ForegroundColor Cyan
    npm test
}

# 6. Verify environment variables
Write-Host "🔍 Verifying environment variables..." -ForegroundColor Cyan
if (!(Test-Path ".env.production")) {
    Write-Host "❌ .env.production file not found!" -ForegroundColor Red
    exit 1
}

$EnvContent = Get-Content .env.production
if ($EnvContent -match "VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api") {
    Write-Host "✅ API URL is correctly set" -ForegroundColor Green
} else {
    Write-Host "❌ API URL is not correctly set in .env.production!" -ForegroundColor Red
    exit 1
}

# 7. Ready for deployment
Write-Host "✨ Build completed successfully!" -ForegroundColor Green
Write-Host "🚀 Deploy to Vercel by pushing to the production branch:" -ForegroundColor Cyan
Write-Host "   git push origin production" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Make sure your Vercel project is configured to deploy from the production branch" -ForegroundColor Yellow
