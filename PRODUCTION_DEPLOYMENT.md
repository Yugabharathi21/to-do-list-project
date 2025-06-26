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
   git push
   ```

2. **Verify build**:
   ```bash
   npm run build
   ```

3. **Run tests** (if available):
   ```bash
   npm test
   ```

## Environment Variables

### Frontend (.env.production)

The `.env.production` file contains production-specific environment variables for the frontend:

```bash
# API URL - Production Render Backend
VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api

# Deployment environment
VITE_APP_ENV=production
```

**Important**: Replace `e-ink-todo-backend.onrender.com` with your actual Render backend URL.

### Backend (server/.env.production)

The `server/.env.production` file contains production-specific environment variables for the backend:

```bash
# Server settings
PORT=10000
NODE_ENV=production

# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=production_jwt_secret_should_be_long_and_complex_change_this
JWT_EXPIRES_IN=7d

# Client URL
CLIENT_URL=https://e-ink-todo.vercel.app
```

**Important**: 
- Replace MongoDB URI with your actual MongoDB Atlas connection string
- Set a strong, unique JWT secret
- Update CLIENT_URL with your actual Vercel frontend URL

## Backend Deployment (Render)

1. **Login to Render**: https://dashboard.render.com/

2. **Create a new Web Service**:
   - Connect to your GitHub repository
   - Select the `production` branch
   - Configure as follows:
     - **Name**: `e-ink-todo-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server/index.js`

3. **Add Environment Variables**:
   - Copy all variables from `server/.env.production`
   - Set `MONGODB_URI` to your actual MongoDB Atlas connection string
   - Set a strong `JWT_SECRET` (different from the one in the .env file)
   - Leave `CLIENT_URL` blank for now (we'll update it after Vercel deployment)

4. **Create Web Service and Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL should be: `https://to-do-list-project-b0tu.onrender.com`
   - Test the health endpoint: https://e-ink-todo-backend.onrender.com/api/health

## Frontend Deployment (Vercel)

1. **Update `.env.production`**:
   - Update `VITE_API_URL` with your actual Render backend URL

2. **Login to Vercel**: https://vercel.com/dashboard

3. **Import your GitHub repository**:
   - Connect to your GitHub repository
   - Select the `production` branch
   - Configure as follows:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

4. **Add Environment Variables**:
   - Add all variables from `.env.production`
   - Make sure `VITE_API_URL` points to your actual Render backend

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend URL should be: `https://spicez-to-do.vercel.app`

## Post-Deployment Configuration

1. **Update Render Backend**:
   - Go back to Render dashboard
   - Open your backend service
   - Add/update the `CLIENT_URL` environment variable with your actual Vercel URL
   - Save changes and wait for redeployment

2. **Test the application**:
   - Open your Vercel URL
   - Test user registration and login
   - Test creating, editing, and completing tasks
   - Verify that all features work as expected

## Production Monitoring

1. **Backend Monitoring**:
   - Render provides built-in logs: Dashboard > Your Service > Logs
   - Consider adding Sentry for error tracking

2. **Frontend Monitoring**:
   - Set up error tracking with Sentry
   - Add analytics with Google Analytics or Plausible

3. **Database Monitoring**:
   - MongoDB Atlas provides monitoring tools in its dashboard

4. **Regular Health Checks**:
   - Set up a service like UptimeRobot to monitor your API health endpoint
   - Create alerts for service disruptions

5. **Keep Render service active**:
   - Free Render services sleep after inactivity
   - Set up a ping service (e.g., UptimeRobot) to ping your API every 10 minutes

## Common Deployment Issues and Troubleshooting

### Registration Failures

If you encounter "Registration failed. Please try again" errors:

1. **Backend Connectivity**:
   - Verify your frontend `VITE_API_URL` correctly points to your Render backend
   - Check Render logs for connection errors or API failures
   - Test backend directly with Postman or curl: 
     ```bash
     curl -X POST https://your-backend-url.onrender.com/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
     ```

2. **CORS Issues**:
   - Verify `CLIENT_URL` in your backend environment variables matches your Vercel URL exactly
   - Check browser console for CORS errors
   - Temporary fix: Update CORS settings in `server/index.js` to allow all origins during testing:
     ```javascript
     app.use(cors({
       origin: '*',
       credentials: true
     }));
     ```

3. **MongoDB Connection**:
   - Verify MongoDB connection string in Render environment variables
   - Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render's dynamic IPs
   - Check Render logs for MongoDB connection errors

4. **User Schema Validation**:
   - If registration data fails validation, check your frontend form values
   - Common issues: email format, password length, missing required fields

5. **JWT Configuration**:
   - Verify `JWT_SECRET` is properly set in Render environment variables
   - Check for JWT generation errors in Render logs

6. **Rate Limiting**:
   - If you've implemented rate limiting, it might block registration attempts
   - Check for 429 Too Many Requests errors in browser console

7. **Server Cold Start**:
   - Free tier Render services sleep after inactivity
   - First request after sleep may time out
   - Solution: Wait and try again, or upgrade to paid tier

### Quick Fix Checklist

1. Restart your Render service: Dashboard > Your service > Manual Deploy > Deploy latest commit
2. Verify environment variables in Render and Vercel
3. Test API directly with Postman or curl
4. Clear browser cache and cookies
5. Try registration in incognito/private browsing mode

---

For more detailed deployment information, refer to the main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
