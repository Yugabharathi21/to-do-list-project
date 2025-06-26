# Unified Environment Variables & Deployment Guide

## Single Environment File Approach

This project uses a **unified environment file** approach where both frontend and backend variables are stored in a single `.env` file in the root directory. This simplifies environment management while maintaining clear separation between frontend (`VITE_` prefixed) and backend variables.

## Environment Variables Setup

Create a single `.env` file in the **root directory** (not in server/ folder) with the following structure:

```bash
# Unified Environment Configuration
# This file contains both frontend (VITE_) and backend variables

# ===== BACKEND CONFIGURATION =====
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - MongoDB Connection String
MONGODB_URI=your-production-mongodb-uri

# JWT Configuration
JWT_SECRET=your-super-strong-jwt-secret-for-production
JWT_EXPIRES_IN=7d

# Client URL (for CORS) - Your frontend URL
CLIENT_URL=https://your-production-frontend-url.com

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again later.

# Request Body Limits
REQUEST_SIZE_LIMIT=10mb

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# User Validation Limits
USER_NAME_MAX_LENGTH=50
USER_PASSWORD_MIN_LENGTH=6

# Email configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password

# ===== FRONTEND CONFIGURATION =====
# API URL for frontend (VITE_ prefix required for Vite)
VITE_API_URL=https://your-production-backend-url.com

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=SPiceZ To-Do List
VITE_APP_VERSION=1.0.0

# Optional: Analytics (uncomment if needed)
# VITE_GA_TRACKING_ID=G-XXXXXXXXXX
# VITE_SENTRY_DSN=https://xxxxx.ingest.sentry.io/xxxxx
```

## Benefits of Unified Approach

✅ **Single source of truth** - All environment variables in one place  
✅ **Easier maintenance** - No need to sync between multiple files  
✅ **Simpler deployment** - Only one environment file to manage  
✅ **Clear separation** - Frontend variables use `VITE_` prefix  
✅ **Better organization** - Grouped by frontend/backend sections

## Deployment Steps

### 1. Backend Deployment

**For platforms like Render, Railway, or Heroku:**

1. Set all the above backend environment variables in your platform's environment settings
2. Build command: `npm install`
3. Start command: `npm run start`
4. Make sure PORT is set to the platform's provided port (usually handled automatically)

**For VPS/Self-hosted:**

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `server/.env`
4. Start the server: `npm run server:prod`

### 2. Frontend Deployment

**For platforms like Vercel, Netlify:**

1. Set the frontend environment variables in your platform's settings
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set up proper redirects for SPA routing

**For static hosting:**

1. Set environment variables in `.env.production`
2. Build the project: `npm run client:build`
3. Deploy the `dist` folder contents

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client:dev` - Start frontend in development mode
- `npm run client:build` - Build frontend for production
- `npm run server:dev` - Start backend in development mode
- `npm run server:prod` - Start backend in production mode
- `npm start` - Start backend in production mode (for deployment platforms)

## Security Checklist

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Use a secure MongoDB connection string
- [ ] Set NODE_ENV=production for backend
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting appropriately
- [ ] Use HTTPS in production
- [ ] Keep environment variables secure and never commit them to version control

## Required Environment Variables for Deployment

### Backend (Critical)
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret for JWT tokens
- `CLIENT_URL` - Your frontend URL for CORS
- `NODE_ENV` - Set to "production"

### Frontend (Critical)  
- `VITE_API_URL` - Your backend API URL
- `VITE_APP_ENV` - Set to "production"

All other variables have sensible defaults but can be customized as needed.
