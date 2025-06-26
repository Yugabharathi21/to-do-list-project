```markdown
# CORS Error Troubleshooting Guide

This document explains how to fix CORS (Cross-Origin Resource Sharing) errors in the E-ink Todo List application.

## The Issue

You might encounter the following error in the browser console when accessing your deployed frontend:

```
Access to XMLHttpRequest at 'https://to-do-list-project-b0tu.onrender.com/auth/register' from origin 'https://spicez-to-do.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.
```

This error occurs because your backend server is configured to only allow requests from specific origins, and your frontend's origin is not in the allowed list.

## The Solution

### Step 1: Update Environment Variables in Render

1. **Log in to your Render dashboard** at [render.com](https://render.com)
2. **Navigate to your backend service** (e.g., "to-do-list-project")
3. **Go to Environment** tab
4. **Find the `CLIENT_URL` variable** and ensure it's set to your Vercel frontend URL:
   ```
   CLIENT_URL=https://spicez-to-do.vercel.app
   ```
5. **Save changes** and wait for your service to redeploy

### Step 2: Verify Your Server Code

Make sure your server's CORS configuration is correctly using the environment variable:

```javascript
// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true
}));
```

### Step 3: Allow Multiple Origins (Optional)

If you need to allow multiple origins (e.g., both your Vercel URL and a custom domain), you can modify the CORS configuration:

```javascript
// CORS configuration with multiple origins
const allowedOrigins = ['https://spicez-to-do.vercel.app', 'https://your-custom-domain.com'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    } else {
      // In development, allow localhost
      return callback(null, true);
    }
  },
  credentials: true
}));
```

## Testing the Fix

After updating your environment variables and redeploying:

1. Clear your browser cache and cookies
2. Try registering or logging in again
3. Check the browser console for any remaining CORS errors

## Common Mistakes

- **Typos in URL**: Ensure there are no typos in your `CLIENT_URL` value
- **Trailing slashes**: `https://spicez-to-do.vercel.app` is different from `https://spicez-to-do.vercel.app/`
- **Protocol mismatch**: `http://` vs `https://` matters for CORS
- **Environment variable not applied**: Some platforms require a redeploy after changing environment variables

## Additional Resources

- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS package documentation](https://github.com/expressjs/cors)
```
