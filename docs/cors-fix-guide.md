```markdown
# Fixing CORS and API Connection Issues

This guide provides specific steps to fix the CORS issues between your Vercel frontend and Render backend.

## Issue Detected
Your frontend on Vercel (`https://spicez-to-do.vercel.app`) can't connect to your backend on Render (`https://to-do-list-project-b0tu.onrender.com`) due to CORS configuration issues.

Error message:
```
Access to XMLHttpRequest at 'https://to-do-list-project-b0tu.onrender.com/api/auth/register' from origin 'https://spicez-to-do.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.
```

## Solution Steps

### 1. Update Render Environment Variables (Fast Fix)

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service (`to-do-list-project-b0tu`)
3. Go to the **Environment** tab
4. Find the `CLIENT_URL` environment variable 
5. Change its value to: `https://spicez-to-do.vercel.app`
6. Click **Save Changes**
7. Wait for the service to redeploy (this may take a few minutes)

### 2. Test the Connection

After the Render service finishes redeploying:
1. Open your Vercel app in an incognito browser window (to avoid cached issues)
2. Try to register or log in
3. Check browser console for any errors

### 3. If Issues Persist: Direct CORS Fix

If the issue persists, you can temporarily modify your server code for debugging:

1. Update your server's CORS configuration to:

```javascript
// CORS configuration with multiple origins
const allowedOrigins = ['https://spicez-to-do.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('Blocked origin:', origin); // For debugging
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));
```

2. Redeploy your backend service with this change

### 4. Verify API Path Structure

Make sure your frontend API calls are correctly structured:

1. Check that your frontend's `.env.production` contains:
   ```
   VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api
   ```

2. Verify your API calling code in `src/lib/api.ts` is using the correct API endpoints:
   ```typescript
   // This is correct (the /api is already in the base URL):
   api.post('/auth/register', userData)
   
   // This is incorrect (double /api):
   api.post('/api/auth/register', userData)
   ```

### 5. Check Server Routes

Ensure your server routes are correctly defined:

```javascript
// These routes should be mounted under /api
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
```

### 6. Test with Postman

To verify if it's a CORS issue or an API issue:

1. Use [Postman](https://www.postman.com/) to make a direct request to:
   ```
   POST https://to-do-list-project-b0tu.onrender.com/api/auth/register
   ```
   With appropriate JSON request body

2. If this works in Postman but not in your browser, it's definitely a CORS issue

## Additional Troubleshooting

If updating the `CLIENT_URL` doesn't resolve the issue:

1. Check if your Render service is using a web service that supports CORS
2. Verify no proxy or firewall is blocking the connection
3. Consider temporarily allowing all origins to diagnose the issue:
   ```javascript
   app.use(cors({ origin: '*' })); // TEMPORARY ONLY FOR TESTING
   ```
4. Check that your server is correctly responding to OPTIONS preflight requests
```
