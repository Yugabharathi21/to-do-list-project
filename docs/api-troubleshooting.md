```markdown
# API Troubleshooting Guide

This document provides guidance for troubleshooting common API connection issues in the E-ink Todo List application.

## CORS Errors

If you're seeing errors like this:

```
Access to XMLHttpRequest at 'https://to-do-list-project-b0tu.onrender.com/auth/register' from origin 'https://spicez-to-do.vercel.app' has been blocked by CORS policy
```

### Problem 1: Missing `/api` Prefix

Your API endpoints should have the `/api` prefix, as configured in your server. 

**Incorrect URL:**
```
https://to-do-list-project-b0tu.onrender.com/auth/register
```

**Correct URL:**
```
https://to-do-list-project-b0tu.onrender.com/api/auth/register
```

### Solution:

1. Check your `api.ts` file to ensure the base URL is correctly configured:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

2. Make sure your `.env.production` file has the correct API URL:

```
VITE_API_URL=https://to-do-list-project-b0tu.onrender.com/api
```

Note: The `/api` should be part of the URL.

3. Verify all your API calls use the correct paths:

```typescript
// Correct:
api.post('/auth/register', userData)

// Incorrect (double /api prefix):
api.post('/api/auth/register', userData)
```

## Problem 2: CORS Configuration on Backend

If your API URL is correct but you're still getting CORS errors:

1. **Update the CLIENT_URL on Render**:
   - Go to your Render dashboard
   - Select your backend service
   - Go to the "Environment" tab
   - Set `CLIENT_URL=https://spicez-to-do.vercel.app`
   - Save changes and wait for redeployment

2. **Verify your server's CORS configuration**:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? process.env.CLIENT_URL 
       : 'http://localhost:5173',
     credentials: true
   }));
   ```

## Problem 3: API Endpoint Not Found (404)

If you're getting 404 errors when trying to access API endpoints:

1. **Check your server routes** to ensure they're correctly defined
2. **Verify the endpoint path** is correct in your API calls
3. **Check that your server is running** and accessible

## Testing Your API

You can use Postman to test your API endpoints directly:

1. Create a new request in Postman
2. Set the request method (GET, POST, etc.)
3. Enter the full URL (e.g., `https://to-do-list-project-b0tu.onrender.com/api/auth/register`)
4. Set appropriate headers (Content-Type: application/json)
5. Add request body if needed
6. Send the request and check the response

## Advanced Debugging

For more complex API issues:

1. **Check server logs** in your Render dashboard
2. **Implement detailed logging** in your error handling middleware
3. **Test with curl or Postman** to isolate frontend vs. backend issues
```
