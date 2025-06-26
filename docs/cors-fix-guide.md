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

1. **Install Postman**: Download and install from [postman.com](https://www.postman.com/downloads/)

2. **Set Up a Registration Request**:
   - Create a new request in Postman
   - Set method to `POST`
   - Enter URL: `https://to-do-list-project-b0tu.onrender.com/api/auth/register`
   - Go to the "Headers" tab and add:
     ```
     Content-Type: application/json
     ```
   - Go to the "Body" tab
   - Select "raw" and choose "JSON" format
   - Add this JSON body:
     ```json
     {
       "name": "Test User",
       "email": "testuser@example.com",
       "password": "Password123!"
     }
     ```
   - Click "Send"

3. **Expected Successful Response** (Status 201 Created):
   ```json
   {
     "success": true,
     "user": {
       "_id": "60d5e4c82a7f3b001f234a7b",
       "name": "Test User",
       "email": "testuser@example.com",
       "createdAt": "2025-06-26T12:34:56.789Z",
       "updatedAt": "2025-06-26T12:34:56.789Z"
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

4. **Set Up a Login Request**:
   - Create another new request
   - Set method to `POST`
   - Enter URL: `https://to-do-list-project-b0tu.onrender.com/api/auth/login`
   - Add the same Content-Type header
   - Add this JSON body:
     ```json
     {
       "email": "testuser@example.com",
       "password": "Password123!"
     }
     ```
   - Click "Send"

5. **Expected Login Response** (Status 200 OK):
   ```json
   {
     "success": true,
     "user": {
       "_id": "60d5e4c82a7f3b001f234a7b",
       "name": "Test User",
       "email": "testuser@example.com"
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

6. **Testing Protected Routes**:
   - Create a new request to get tasks
   - Set method to `GET`
   - Enter URL: `https://to-do-list-project-b0tu.onrender.com/api/tasks`
   - Add Authorization header with the token:
     ```
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Click "Send"

7. **Interpreting Results**:
   - If requests work in Postman but not in your browser, it's definitely a CORS issue
   - If requests fail in both Postman and browser, check your server's API implementation

## Additional Troubleshooting

If updating the `CLIENT_URL` doesn't resolve the issue:

1. Check if your Render service is using a web service that supports CORS
2. Verify no proxy or firewall is blocking the connection
3. Consider temporarily allowing all origins to diagnose the issue:
   ```javascript
   app.use(cors({ origin: '*' })); // TEMPORARY ONLY FOR TESTING
   ```
4. Check that your server is correctly responding to OPTIONS preflight requests

## Common API Error Troubleshooting

When testing with Postman, you might encounter these common errors:

### 1. 401 Unauthorized

**Symptoms**:
```json
{
  "message": "Not authorized, no token"
}
```

**Solutions**:
- Check that you're including the `Authorization` header with the format `Bearer yourTokenHere`
- Ensure your token is valid and not expired (tokens expire after the time set in JWT_EXPIRES_IN)
- Try logging in again to get a fresh token

### 2. 400 Bad Request

**Symptoms**:
```json
{
  "message": "Please provide all required fields"
}
```

**Solutions**:
- Check that your JSON body includes all required fields
- Verify field types match what the API expects (strings, numbers, etc.)
- Look for typos in field names

### 3. 404 Not Found

**Symptoms**:
```json
{
  "message": "Task not found"
}
```

**Solutions**:
- Verify the ID you're using is correct
- Ensure the resource actually exists
- Check that you're using the correct endpoint URL

### 4. 409 Conflict

**Symptoms**:
```json
{
  "message": "Email already exists"
}
```

**Solutions**:
- Use a different email for registration
- Try logging in instead of registering

### 5. 500 Internal Server Error

**Symptoms**:
```json
{
  "message": "Something went wrong!"
}
```

**Solutions**:
- Check server logs for more detailed error information
- Verify your MongoDB connection is working
- Ensure your request format is correct

## Using Postman Collections

For more efficient API testing, you can create a complete Postman Collection for your E-ink Todo app:

### Creating a Postman Collection

1. **Create a New Collection**:
   - Click "Collections" in the sidebar
   - Click the "+" icon to create a new collection
   - Name it "E-ink Todo API"

2. **Set Up Environment Variables**:
   - Click "Environments" in the sidebar
   - Create a new environment named "Todo Production"
   - Add these variables:
     - `base_url`: `https://to-do-list-project-b0tu.onrender.com/api`
     - `token`: Leave it empty initially (will be filled after login)

3. **Create Request for Registration**:
   - Right-click your collection → Add Request
   - Name it "Register User"
   - Set up as described earlier
   - Use `{{base_url}}/auth/register` as the URL
   - Add a "Tests" script to save the token:
     ```javascript
     if (pm.response.code === 201 || pm.response.code === 200) {
         var jsonData = pm.response.json();
         if (jsonData.token) {
             pm.environment.set("token", jsonData.token);
             console.log("Token saved to environment");
         }
     }
     ```

4. **Create Login Request**:
   - Similar to registration, but using `{{base_url}}/auth/login`
   - Include the same token-saving script

5. **Create Tasks Requests**:
   - Create GET, POST, PUT, DELETE requests for tasks
   - Use `{{base_url}}/tasks` as the base URL
   - In the Authorization section, select "Bearer Token" and use `{{token}}`

### Sample Requests for Complete API Testing

Here's a comprehensive set of requests to test your entire API:

1. **Authentication**:
   - Register: `POST {{base_url}}/auth/register`
   - Login: `POST {{base_url}}/auth/login`
   - Get Profile: `GET {{base_url}}/auth/profile`

2. **Tasks**:
   - Get All Tasks: `GET {{base_url}}/tasks`
   - Create Task: `POST {{base_url}}/tasks`
     ```json
     {
       "title": "Test Task",
       "description": "This is a test task created via Postman",
       "priority": "medium",
       "dueDate": "2025-07-01T12:00:00.000Z",
       "completed": false
     }
     ```
   - Get Single Task: `GET {{base_url}}/tasks/:id`
   - Update Task: `PUT {{base_url}}/tasks/:id`
     ```json
     {
       "title": "Updated Task Title",
       "completed": true
     }
     ```
   - Delete Task: `DELETE {{base_url}}/tasks/:id`
   - Get Task Stats: `GET {{base_url}}/tasks/stats`

3. **Notes**:
   - Get All Notes: `GET {{base_url}}/notes`
   - Create Note: `POST {{base_url}}/notes`
     ```json
     {
       "title": "Test Note",
       "content": "This is a test note created with Postman",
       "color": "blue"
     }
     ```
   - Get Single Note: `GET {{base_url}}/notes/:id`
   - Update Note: `PUT {{base_url}}/notes/:id`
   - Delete Note: `DELETE {{base_url}}/notes/:id`

### Importing Ready-Made Postman Files

For your convenience, I've created ready-to-import Postman files:

1. **Collection File**: [e-ink-todo-api-collection.json](./e-ink-todo-api-collection.json)
   - Contains all API endpoints pre-configured
   - Includes test scripts that automatically save tokens

2. **Environment File**: [e-ink-todo-environment.json](./e-ink-todo-environment.json)
   - Contains environment variables for the API
   - Provides placeholders for tokens and IDs

**To import these files**:

1. Open Postman
2. Click "Import" in the top left
3. Drag and drop both files or select them from your file system
4. Click "Import"
5. Select the imported environment from the environment dropdown (top right)

These files are already configured to work with your API at `https://to-do-list-project-b0tu.onrender.com/api` and include all the necessary endpoints for authentication, tasks, and notes.

### Export/Import Collection

You can export this collection for sharing with your team:
1. Click the three dots next to your collection
2. Select "Export"
3. Choose JSON format
4. Save the file

Others can import it using:
1. Click "Import" button
2. Select the file or drag and drop it
3. Click "Import"

This complete collection allows you to systematically test all aspects of your API and diagnose where issues might be occurring.
```
