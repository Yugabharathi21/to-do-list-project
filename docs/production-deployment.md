```markdown
# Production Deployment Guide

This document provides specific instructions for deploying the production branch of the E-ink Todo List Application.

## Table of Contents
1. [Production Branch Setup](#production-branch-setup)
2. [Environment Variables](#environment-variables)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Production Monitoring](#production-monitoring)

## Production Branch Setup

Before deploying, ensure your production branch is properly configured:

1. **Merge changes from development**:
   ```bash
   git checkout development
   git pull
   git checkout production
   git merge development
   git push origin production
   ```

2. **Verify build**:
   ```bash
   npm run build
   ```

## Environment Variables

### Frontend (.env.production)

Ensure your `.env.production` file contains the correct production values:

```
VITE_API_URL=https://your-backend-url.render.com
```

### Backend (server/.env.production)

Set up your `server/.env.production` file:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdb
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Backend Deployment (Render)

1. **Connect Render to GitHub repository**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure deployment settings**:
   - Name: `e-ink-todo-backend`
   - Runtime: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Environment Variables: Add all variables from `server/.env.production`

3. **Deploy backend**:
   - Click "Create Web Service"
   - Wait for deployment to complete

## Frontend Deployment (Vercel)

1. **Connect Vercel to GitHub repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure deployment settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add all variables from `.env.production`

3. **Deploy frontend**:
   - Click "Deploy"
   - Use the URL: `https://spicez-to-do.vercel.app/`

## Post-Deployment Configuration

After both services are deployed:

1. **Update CORS configuration**:
   - Ensure CORS_ORIGIN in backend matches your Vercel URL

2. **Verify API connection**:
   - Test API endpoints using Postman
   - Check API responses in browser developer tools

3. **Test user authentication flows**:
   - Register a new test user
   - Login with test user credentials
   - Verify JWT token reception and storage

## Production Monitoring

Monitor your production application:

1. **Server logs**:
   - Check Render logs for backend errors
   - Set up log rotation for long-term storage

2. **Performance monitoring**:
   - Set up basic monitoring for API response times
   - Monitor database connection health

3. **Error tracking**:
   - Implement error tracking to catch and log frontend issues
   - Set up notifications for critical backend errors
```
