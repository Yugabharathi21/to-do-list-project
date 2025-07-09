# Environment Configuration Guide

This project now uses a simplified environment configuration system that makes it easy to switch between development and production modes.

## 📁 Environment Files

- `.env.development` - Development configuration (localhost, local MongoDB, etc.)
- `.env.production` - Production configuration (production URLs, production database, etc.)  
- `.env` - Active environment file (automatically created when switching)

## 🔄 Switching Environments

### Method 1: Using npm scripts (Recommended)
```bash
# Switch to development mode
npm run env:dev

# Switch to production mode  
npm run env:prod

# Run development environment
npm run dev

# Run production environment
npm run prod
```

### Method 2: Using Node.js script
```bash
# Switch to development
node switch-env.js development

# Switch to production
node switch-env.js production
```

### Method 3: Using PowerShell (Windows)
```powershell
# Switch to development
.\switch-env.ps1 development

# Switch to production
.\switch-env.ps1 production
```

## 🚀 Quick Start

1. **For Development:**
   ```bash
   npm run env:dev
   npm run dev
   ```

2. **For Production:**
   ```bash
   npm run env:prod
   npm run prod
   ```

## 📋 What Each Environment Contains

### Development (.env.development)
- `NODE_ENV=development`
- `MONGODB_URI=mongodb://localhost:27017/todo-app`
- `CLIENT_URL=http://localhost:5173`
- `VITE_API_URL=http://localhost:5000`
- Lower security settings for easier development
- Debug mode enabled

### Production (.env.production)
- `NODE_ENV=production`
- Production MongoDB connection
- Production frontend/backend URLs
- Higher security settings
- Debug mode disabled

## 🔧 Customization

To modify environment variables:
1. Edit `.env.development` or `.env.production` directly
2. Run the switch command to apply changes
3. The `.env` file will be automatically updated

## 🚨 Important Notes

- Never commit `.env` to version control (it's auto-generated)
- Keep `.env.development` and `.env.production` in version control
- The switching scripts will show you the current configuration after switching
- Always switch environments before running your application

## 📄 Environment Variables Overview

| Variable | Development | Production |
|----------|-------------|------------|
| NODE_ENV | development | production |
| MONGODB_URI | Local MongoDB | Production MongoDB |
| CLIENT_URL | localhost:5173 | Production frontend URL |
| VITE_API_URL | localhost:5000 | Production backend URL |
| BCRYPT_SALT_ROUNDS | 10 | 12 |
| VITE_APP_DEBUG | true | false |
