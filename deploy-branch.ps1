param(
    [Parameter(Mandatory=$true)]
    [string]$branch
)

Write-Host "🚀 Deploying branch: $branch to Vercel..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm i -g vercel
}

# Make sure we're logged in
Write-Host "🔑 Ensuring you're logged in to Vercel..." -ForegroundColor Cyan
vercel whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

# Checkout the specified branch
Write-Host "🔄 Checking out $branch branch..." -ForegroundColor Cyan
git checkout $branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to checkout branch: $branch" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed." -ForegroundColor Red
}
