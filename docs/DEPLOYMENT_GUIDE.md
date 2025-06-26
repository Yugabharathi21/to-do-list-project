# Comprehensive Deployment Guide
# E-ink Todo App Deployment Guide

This guide provides detailed instructions for deploying the E-ink Todo List Application with the frontend on Vercel and the backend on Render.

## Table of Contents

1. [Pre-Deployment Preparation](#pre-deployment-preparation)
2. [Backend Deployment on Render](#backend-deployment-on-render)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Maintaining and Updating Your Deployment](#maintaining-and-updating-your-deployment)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Pre-Deployment Preparation

Before deploying your application, make sure your codebase is properly prepared:

### 1. Setup Environment Variables

Create separate environment files for development and production:

#### For Local Development
Create a `.env.development` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

#### For Production
Create a `.env.production` file in the root directory:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### 2. Update API Configuration

Ensure your API client (`src/lib/api.ts`) uses the environment variables:

```typescript
import axios from 'axios';
import { useAuthStore } from './store';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized, 403 Forbidden)
    return Promise.reject(error);
  }
);

export default api;
// Export specific API services...
```

### 3. Update your vite.config.ts

Ensure your Vite configuration is properly set up:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### 4. Create Vercel Configuration

Create a `vercel.json` file in your project root to handle client-side routing:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "github": {
    "silent": true
  }
}
```

## Backend Deployment on Render

### 1. Prepare Your Backend Code

Ensure your backend code is ready for production:

1. **Environment Variables**: Update your `server/index.js` to handle production environment:

```javascript
// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
```

2. **Error Handling**: Make sure you have proper error handling for production:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});
```

### 2. Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account or log in

2. **Create a New Cluster**:
   - Click "Build a Cluster"
   - Choose the "FREE" shared cluster option
   - Select a cloud provider (AWS, Google Cloud, or Azure) and region
   - Click "Create Cluster" (creation can take a few minutes)

3. **Set Up Database Access**:
   - Go to "Database Access" under the Security section
   - Click "Add New Database User"
   - Create a username and password (use a strong, secure password)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access" under the Security section
   - Click "Add IP Address"
   - Select "Allow Access From Anywhere" (adds 0.0.0.0/0)
   - Click "Confirm"

5. **Get Your Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select your driver version (Node.js)
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with your database name (e.g., "todo-app")

### 3. Deploy Backend to Render

1. **Sign Up/Login to Render**:
   - Go to [Render](https://render.com/)
   - Create an account or log in

2. **Create a New Web Service**:
   - Click on "New" in the dashboard
   - Select "Web Service"

3. **Connect Your Repository**:
   - Connect your GitHub/GitLab account if not already connected
   - Find and select your project repository

4. **Configure the Web Service**:
   - **Name**: `e-ink-todo-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free (or choose a paid plan if needed)

5. **Add Environment Variables**:
   - Scroll down to the "Environment Variables" section
   - Add the following key-value pairs:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render will override this with its own port)
     - `CLIENT_URL`: The URL where your frontend will be deployed (you can update this later)

6. **Deploy the Service**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - This process may take a few minutes

7. **Verify Backend Deployment**:
   - Once deployed, note down the service URL provided by Render
     (e.g., `https://e-ink-todo-backend.onrender.com`)
   - Test the health endpoint by visiting `https://e-ink-todo-backend.onrender.com/api/health`
   - You should see a JSON response with status "OK"

## Frontend Deployment on Vercel

### 1. Prepare Your Frontend for Deployment

1. **Set Production Environment Variable**:
   - Update your `.env.production` file with your Render backend URL:
   ```
   VITE_API_URL=https://e-ink-todo-backend.onrender.com/api
   ```

2. **Push Changes to Your Repository**:
   - Commit all changes to your repository
   - Push the changes to GitHub/GitLab

### 2. Deploy to Vercel

1. **Sign Up/Login to Vercel**:
   - Go to [Vercel](https://vercel.com/)
   - Create an account or log in

2. **Import Your Repository**:
   - Click on "Add New..."
   - Select "Project"
   - Connect your GitHub/GitLab account if not already connected
   - Find and select your project repository

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (if your package.json is in the root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Expand the "Environment Variables" section
   - Add the key-value pair:
     - `VITE_API_URL`: `https://e-ink-todo-backend.onrender.com/api`

5. **Deploy the Project**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - This process may take a few minutes

6. **Verify Frontend Deployment**:
   - Once deployed, Vercel will provide a URL for your project
     (e.g., `https://e-ink-todo.vercel.app`)
   - Visit the URL to ensure your app loads correctly

## Post-Deployment Configuration

### 1. Update Backend CORS Configuration

Now that your frontend is deployed, update the CORS configuration on your backend:

1. **Go to Render Dashboard**:
   - Find your backend service
   - Click on "Environment"
   - Update the `CLIENT_URL` variable with your Vercel URL (e.g., `https://e-ink-todo.vercel.app`)
   - Click "Save Changes"
   - Render will automatically redeploy your backend with the new configuration

### 2. Test End-to-End Functionality

1. **Visit your Vercel URL**
2. **Test User Authentication**:
   - Register a new account
   - Log in with the credentials
3. **Test Task Management**:
   - Create a new task
   - Update an existing task
   - Delete a task
4. **Test Other Features**:
   - Create and manage notes
   - Check calendar view if implemented
   - Test profile management

## Maintaining and Updating Your Deployment

### Continuous Deployment

Both Vercel and Render offer continuous deployment by default:

1. **When you push changes to your main branch**:
   - Vercel will automatically detect the changes and redeploy the frontend
   - Render will automatically detect the changes and redeploy the backend

2. **Manual Redeployment**:
   - **Vercel**: Go to your project dashboard and click "Redeploy"
   - **Render**: Go to your service dashboard and click "Manual Deploy" > "Deploy latest commit"

### Monitoring Your Application

1. **Vercel Analytics**:
   - Go to your project dashboard
   - Click on "Analytics" to view performance metrics

2. **Render Logs**:
   - Go to your service dashboard
   - Click on "Logs" to view server logs

3. **Add Application Monitoring** (Optional):
   - Integrate services like [Sentry](https://sentry.io) for error tracking
   - Add [LogRocket](https://logrocket.com) for session replay and frontend monitoring

### Managing Environment Variables

1. **Updating Environment Variables on Vercel**:
   - Go to your project dashboard
   - Click on "Settings" > "Environment Variables"
   - Add, edit, or delete environment variables as needed
   - Click "Save" and redeploy if necessary

2. **Updating Environment Variables on Render**:
   - Go to your service dashboard
   - Click on "Environment"
   - Update environment variables as needed
   - Click "Save Changes" to apply and trigger a redeploy

## Troubleshooting Common Issues

### CORS Issues

If you're experiencing CORS errors in your browser console:

1. **Double Check CORS Configuration**:
   - Ensure the `CLIENT_URL` on Render matches your Vercel URL exactly
   - Make sure there's no trailing slash in the URL

2. **Test CORS with curl**:
   ```bash
   curl -X OPTIONS -H "Origin: https://your-vercel-url.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     --verbose https://your-render-backend.onrender.com/api/auth/login
   ```

3. **Update CORS Configuration**:
   ```javascript
   app.use(cors({
     origin: function(origin, callback) {
       // Allow requests with no origin (like mobile apps, curl)
       if(!origin) return callback(null, true);
       
       const allowedOrigins = [
         'https://your-vercel-url.vercel.app',
         'http://localhost:5173'
       ];
       
       if(allowedOrigins.indexOf(origin) === -1) {
         return callback(new Error('CORS policy violation'), false);
       }
       
       return callback(null, true);
     },
     credentials: true,
     optionsSuccessStatus: 200
   }));
   ```

### MongoDB Connection Issues

If your backend can't connect to MongoDB:

1. **Check Connection String**:
   - Verify the connection string format
   - Make sure `<password>` and `<dbname>` are replaced with actual values

2. **Network Access**:
   - Ensure your MongoDB Atlas cluster allows access from anywhere (IP: 0.0.0.0/0)
   - Render's IP addresses change, so specific IP whitelisting won't work

3. **Database User Permissions**:
   - Verify your database user has read/write permissions

### 404 Errors on Page Refresh

For client-side routing issues:

1. **Verify Vercel Configuration**:
   - Make sure your `vercel.json` file is correctly configured

2. **Check React Router Setup**:
   - Ensure you're using `BrowserRouter` (not `HashRouter`)
   - Make sure your routes are properly configured

### Slow Initial Load on Render

Free tier Render services spin down after periods of inactivity:

1. **Keep Your Service Warm**:
   - Set up a scheduled job (e.g., using [cron-job.org](https://cron-job.org)) to ping your health endpoint every 10-15 minutes

2. **Upgrade to Paid Tier**:
   - Consider upgrading to a paid Render plan for services that need to stay active

### Authentication Issues

If users can't log in or register:

1. **JWT Configuration**:
   - Verify your JWT secret is set correctly
   - Check JWT expiration settings

2. **Request/Response Flow**:
   - Use browser DevTools to monitor network requests
   - Check request payload and response data for errors

---

By following this guide, your E-ink Todo List Application should be successfully deployed with the frontend on Vercel and the backend on Render. If you encounter any issues not covered in this guide, refer to the official documentation for [Vercel](https://vercel.com/docs) and [Render](https://render.com/docs).
