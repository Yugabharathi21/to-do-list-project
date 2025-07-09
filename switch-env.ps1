# Environment Switcher Script for Windows PowerShell
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "production")]
    [string]$Mode
)

$ErrorActionPreference = "Stop"

$sourceFile = ".env.$Mode"
$targetFile = ".env"

try {
    if (!(Test-Path $sourceFile)) {
        Write-Host "❌ Environment file $sourceFile not found!" -ForegroundColor Red
        exit 1
    }

    # Copy the environment file
    Copy-Item $sourceFile $targetFile -Force
    
    Write-Host "✅ Successfully switched to $($Mode.ToUpper()) mode" -ForegroundColor Green
    Write-Host "📁 Copied $sourceFile → $targetFile" -ForegroundColor Cyan
    
    # Show some key values
    $content = Get-Content $targetFile -Raw
    $nodeEnv = ($content | Select-String "NODE_ENV=(.+)").Matches.Groups[1].Value
    $apiUrl = ($content | Select-String "VITE_API_URL=(.+)").Matches.Groups[1].Value
    $clientUrl = ($content | Select-String "CLIENT_URL=(.+)").Matches.Groups[1].Value
    
    Write-Host ""
    Write-Host "📋 Current configuration:" -ForegroundColor Yellow
    Write-Host "   NODE_ENV: $nodeEnv" -ForegroundColor White
    Write-Host "   API URL: $apiUrl" -ForegroundColor White
    Write-Host "   CLIENT URL: $clientUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 You can now run your application with the selected environment!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error switching environment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
