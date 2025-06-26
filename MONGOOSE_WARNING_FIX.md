# Mongoose Warning Fix

This document explains the fix for the Mongoose warning about duplicate schema indexes.

## The Issue

You were seeing the following warning in your server logs:

```
(node:129) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
```

## The Cause

The issue was in your `server/models/User.js` file:

1. The `email` field had `unique: true` which automatically creates an index
2. There was also an explicit index created with `userSchema.index({ email: 1 })`

## The Fix

We removed the explicit index creation for the email field since it was already being created by the `unique: true` property:

```javascript
// Before
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// After
// email index is already created by the unique: true setting
userSchema.index({ createdAt: -1 });
```

## Deploying the Fix to Render

1. **Push changes to GitHub**:
   ```bash
   git add server/models/User.js
   git commit -m "Fix: Remove duplicate email index in User model"
   git push
   ```

2. **Manual Deployment on Render**:
   - Go to your Render dashboard
   - Select your web service
   - Click "Manual Deploy" > "Deploy latest commit"
   
3. **Verify the Fix**:
   - After deployment completes, check the logs
   - The warning about duplicate indexes should no longer appear

## Additional Notes

- This warning didn't affect your application's functionality, but fixing it is good practice
- MongoDB indexes are important for query performance, especially as your data grows
- Always check for warnings in your server logs as they can indicate potential issues

If you're still seeing the warning after deployment, try restarting your service completely through the Render dashboard.
