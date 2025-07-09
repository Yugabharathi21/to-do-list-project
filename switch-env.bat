@echo off
if "%1"=="" (
    echo ❌ Usage: switch-env.bat [development^|production]
    echo.
    echo Examples:
    echo   switch-env.bat development
    echo   switch-env.bat production
    exit /b 1
)

if "%1"=="development" (
    node switch-env.js development
) else if "%1"=="production" (
    node switch-env.js production
) else (
    echo ❌ Invalid mode. Use 'development' or 'production'
    exit /b 1
)
