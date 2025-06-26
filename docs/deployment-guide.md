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
VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api
VITE_APP_ENV=production
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
     (e.g., `https://to-do-list-project-b0tu.onrender.com`)
   - Test the health endpoint by visiting `https://to-do-list-project-b0tu.onrender.com/api/health`
   - You should see a JSON response with status "OK"

## Frontend Deployment on Vercel

### 1. Prepare Your Frontend for Deployment

1. **Set Production Environment Variable**:
   - Update your `.env.production` file with your Render backend URL:
   ```
   VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api
   VITE_APP_ENV=production
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
   - Add the key-value pairs:
     - `VITE_API_URL`: `https://to-do-list-project-b0tu.onrender.com/api`
     - `VITE_APP_ENV`: `production`

5. **Deploy the Project**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - This process may take a few minutes

6. **Verify Frontend Deployment**:
   - Once deployed, your Vercel URL will be: `https://spicez-to-do.vercel.app`
   - Visit the URL to ensure your app loads correctly

## Post-Deployment Configuration

### 1. Update Backend CORS Configuration

Now that your frontend is deployed, update the CORS configuration on your backend:

1. **Go to Render Dashboard**:
   - Find your backend service
   - Click on "Environment"
   - Update the `CLIENT_URL` variable with your Vercel URL: `https://spicez-to-do.vercel.app`
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

### 3. Testing API with Postman Web App

Postman is a powerful tool for testing your API endpoints directly. Using the web version requires no installation:

1. **Access Postman Web App**:
   - Go to [https://web.postman.co](https://web.postman.co)
   - Sign in with your account or create a new one

2. **Create a New Collection**:
   - Click "New" and then "Collection"
   - Name it "E-ink Todo API"
   - Save the collection

3. **Test Authentication Endpoints**:
   
   **Register a New User**:
   - Create a new request (POST)
   - URL: `https://to-do-list-project-b0tu.onrender.com/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "SecurePassword123"
   }
   ```
   - The password must be at least 6 characters long
   - Send the request and verify you receive a success response

   **Login**:
   - Create a new request (POST)
   - URL: `https://to-do-list-project-b0tu.onrender.com/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "SecurePassword123"
   }
   ```
   - Send the request and save the returned token

4. **Test Protected Endpoints**:

   **Create a Task**:
   - Create a new request (POST)
   - URL: `https://to-do-list-project-b0tu.onrender.com/api/tasks`
   - Headers: 
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_TOKEN_HERE`
   - Body (raw JSON):
   ```json
   {
     "title": "Test Task",
     "description": "Testing from Postman",
     "priority": "medium",
     "dueDate": "2025-07-01T12:00:00.000Z"
   }
   ```
   - Send the request and verify the task is created

   **Get All Tasks**:
   - Create a new request (GET)
   - URL: `https://to-do-list-project-b0tu.onrender.com/api/tasks`
   - Headers: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Send the request and verify you can see your tasks

5. **Test Error Handling**:
   - Try to create a task without authentication
   - Try to login with incorrect credentials
   - Try to access a non-existent endpoint

6. **Debugging Error Responses**:
   - For 400 Bad Request errors:
     - Check the response body for detailed error messages
     - Verify all required fields are included and properly formatted
     - Try different values for fields that might be failing validation
   - For 401 Unauthorized errors:
     - Verify the token is correct and not expired
     - Make sure the token is correctly formatted with `Bearer ` prefix
   - For 500 Server errors:
     - Check the Render logs for more detailed error information
     - This usually indicates a server-side issue rather than request format

7. **Save Your Collection**:
   - Save all your requests for future testing
   - You can also export the collection to share with your team

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
   - Check that it contains the proper client-side routing configuration:
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

2. **Check React Router Setup**:
   - Ensure you're using `BrowserRouter` (not `HashRouter`)
   - Make sure your routes are properly configured
   - Verify that your auth routes are defined in your router

### "Route not found" on Login

If you're seeing a "Route not found" error when trying to log in from your Vercel frontend:

1. **API URL Configuration**:
   - Double check that your frontend is using the correct API URL
   - Verify in your browser's developer tools (Network tab) what URL is being called
   - It should be making a request to `https://to-do-list-project-b0tu.onrender.com/api/auth/login`
   - Make sure there are no typos or extra/missing slashes in the URL
   
   **Potential Issue**: Your app doesn't use React Router for routing, but instead relies on view state in `useUIStore`. Make sure your authentication flow properly updates this state after login.

2. **Environment Variable Loading**:
   - Verify your environment variables are correctly loaded in the frontend
   - Add a temporary debug log in your API client file to print the API URL:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

3. **Check API Routes in Backend**:
   - Verify the route exists in your backend server
   - Try accessing the health endpoint directly to ensure the backend is running:
     `https://to-do-list-project-b0tu.onrender.com/api/health`

4. **Manual Route Test**:
   - Use Postman to test the login route directly as shown in the Postman section
   - This helps determine if the issue is with the frontend or backend

5. **Clear Cache and Cookies**:
   - Try clearing your browser's cache and cookies
   - Test in a private/incognito window

6. **Check for CORS Issues**:
   - Look for CORS-related errors in browser console
   - Verify that your backend's CORS configuration includes your Vercel URL

7. **Specific Fix for Your App**:
   - Based on your code structure, you're not using React Router, but a state-based approach
   - Check your auth API implementation in `src/lib/api.ts` to ensure it's handling responses correctly
   - Verify that `useAuthStore` is properly updating the authentication state
   - Add logging to debug the API response:
   ```javascript
   // In your login function
   try {
     const response = await api.post('/auth/login', { email, password });
     console.log('Login response:', response.data);
     // Rest of your code
   } catch (error) {
     console.error('Login error:', error.response?.data || error.message);
     throw error;
   }
   ```
   - Check that your `baseURL` is correctly set to `https://to-do-list-project-b0tu.onrender.com/api`

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

### 400 Bad Request for Registration

If you're getting a 400 Bad Request error when trying to register a new user:

1. **Check Request Format**:
   - Ensure the JSON body exactly matches the expected format:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "SecurePassword123"
   }
   ```
   - Make sure there are no extra or missing fields
   - Note that the field is `name`, not `username`

2. **Validation Issues**:
   - Password must be at least 6 characters long (as per your User model)
   - Email must be valid and not already registered
   - Name cannot exceed 50 characters
   - Email must match proper email format

3. **Check Headers**:
   - Content-Type must be `application/json`
   - Remove any unnecessary headers

4. **Review Server Logs**:
   - Check Render logs for specific validation errors
   - The error message should indicate what field failed validation

5. **Test with Minimal Data**:
   - Try registering with just the required fields
   - Follow the exact field names from your User model

6. **Compare with Working Example**:
   ```json
   {
     "name": "New User",
     "email": "newuser123@example.com",
     "password": "StrongP@ssw0rd"
   }
   ```

7. **Check MongoDB Model**:
   - Review the User model in your code to ensure the registration request matches the expected schema

---

By following this guide, your E-ink Todo List Application should be successfully deployed with the frontend on Vercel and the backend on Render. If you encounter any issues not covered in this guide, refer to the official documentation for [Vercel](https://vercel.com/docs) and [Render](https://render.com/docs).