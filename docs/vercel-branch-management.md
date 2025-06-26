```markdown
# Vercel Deployment Branch Management

This guide explains how to manage which branch Vercel deploys from for your E-ink Todo List application.

## Default Setup

By default, Vercel will deploy from your `main` branch. However, for this project, we use a dedicated `production` branch for production deployments.

## Changing the Deployment Branch

### Using the Vercel Dashboard

1. **Log in to the Vercel dashboard**
   - Go to [vercel.com](https://vercel.com/) and sign in
   - Select your project from the dashboard

2. **Access Git settings**
   - Click on the "Settings" tab
   - Navigate to "Git" in the left sidebar

3. **Change the production branch**
   - Under "Production Branch", click "Edit"
   - Enter your desired branch name (e.g., "production")
   - Click "Save"

### Using the Vercel CLI

You can also change the production branch using the Vercel CLI:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set the production branch**:
   ```bash
   vercel git connect --production-branch production
   ```
   (Replace "production" with your desired branch name)

## Using Our Deployment Scripts

This project includes deployment scripts for easily deploying specific branches:

### Windows (PowerShell)

```powershell
.\deploy-branch.ps1 -branch production
```

### Bash (Linux/Mac)

```bash
./deploy-branch.sh production
```

## Understanding vercel.json Configuration

The `vercel.json` file in this project includes configurations that control deployments:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "github": {
    "silent": true,
    "autoAlias": true
  },
  "git": {
    "deploymentEnabled": {
      "main": false,
      "development": false,
      "production": true
    }
  }
}
```

- **Routes**: Configures routing for SPA (Single Page Application)
- **GitHub Integration**: Controls GitHub integration behavior
- **Git Deployment**: Specifies which branches can be deployed

## Preview Deployments

Vercel normally creates preview deployments for all your GitHub pull requests. This can be controlled in your project settings under "Git Integration" > "Preview Deployments".

## Troubleshooting

If you experience issues with branch deployments:

1. **Check branch permissions**
   - Ensure the GitHub integration has access to the branch

2. **Verify webhook configuration**
   - Check that GitHub webhooks are properly configured for the repository

3. **Force a redeployment**
   - You can force a redeployment from the Vercel dashboard by clicking on "Deployments" and then "Redeploy" on the deployment you want to redeploy

4. **Check deployment logs**
   - Review logs in the Vercel dashboard for any errors during the deployment process
```
