# GitHub Setup and Version Control Guide

This guide provides instructions for setting up a GitHub repository for your E-ink Todo List Application and managing your codebase with version control best practices.

## Table of Contents

1. [Setting Up Your GitHub Repository](#setting-up-your-github-repository)
2. [Version Control Best Practices](#version-control-best-practices)
3. [GitHub Actions for CI/CD](#github-actions-for-cicd)
4. [Collaborating Using GitHub Features](#collaborating-using-github-features)
5. [Branch Protection and Code Review](#branch-protection-and-code-review)
6. [Documentation on GitHub](#documentation-on-github)

## Setting Up Your GitHub Repository

### 1. Create a New Repository

1. **Log in to GitHub**:
   - Go to [GitHub](https://github.com/) and sign in

2. **Create a New Repository**:
   - Click on the "+" icon in the top right corner
   - Select "New repository"
   - Fill in the repository details:
     - **Repository name**: `e-ink-todo-app` (or your preferred name)
     - **Description**: "A modern, professional task management application with an e-ink inspired design theme"
     - **Visibility**: Public or Private (depending on your preference)
     - **Initialize with**:
       - Add a README file
       - Add .gitignore (select Node)
       - Choose a license (MIT is a good choice for open-source projects)
   - Click "Create repository"

### 2. Clone the Repository Locally

1. **Copy the Repository URL**:
   - Click the "Code" button on your repository page
   - Copy the HTTPS or SSH URL

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/e-ink-todo-app.git
   cd e-ink-todo-app
   ```

### 3. Set Up Your Local Project

1. **Copy Your Existing Project Files**:
   - Copy all files from your existing project directory to the cloned repository directory
   - Make sure to exclude node_modules, build directories, and environment files

2. **Create a .gitignore File** (if not already created):
   ```
   # Dependencies
   /node_modules
   /.pnp
   .pnp.js

   # Testing
   /coverage

   # Production
   /build
   /dist

   # Environment files
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   .env.production
   .env.development

   # Logs
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   # Editor directories and files
   .idea
   .vscode/*
   !.vscode/extensions.json
   *.suo
   *.ntvs*
   *.njsproj
   *.sln
   *.sw?

   # OS files
   .DS_Store
   Thumbs.db
   ```

3. **Make Your Initial Commit**:
   ```bash
   git add .
   git commit -m "Initial commit: Project setup"
   git push -u origin main
   ```

## Version Control Best Practices

### 1. Branch Management

Follow a structured branching strategy:

1. **Main Branches**:
   - `main`: Production-ready code
   - `develop`: Integration branch for ongoing development

2. **Supporting Branches**:
   - `feature/*`: For new features (e.g., `feature/subtasks`)
   - `fix/*`: For bug fixes (e.g., `fix/authentication-error`)
   - `release/*`: For preparation of new releases
   - `hotfix/*`: For urgent fixes to production

3. **Creating a Feature Branch**:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/new-feature-name
   ```

4. **Merging a Feature Branch**:
   ```bash
   git checkout develop
   git pull
   git merge --no-ff feature/new-feature-name
   git push origin develop
   ```

### 2. Commit Guidelines

Write clear, descriptive commit messages:

1. **Commit Message Format**:
   ```
   <type>: <short summary>

   <optional body>

   <optional footer>
   ```

2. **Types**:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code changes that neither fix bugs nor add features
   - `test`: Adding or correcting tests
   - `chore`: Changes to the build process or tools

3. **Examples**:
   ```
   feat: add profile page component
   
   - Implements user profile page
   - Adds form for updating user information
   - Connects to user profile API
   ```

   ```
   fix: correct task priority color in dark mode
   
   Fixes #123
   ```

### 3. Pull Request Workflow

1. **Create a Pull Request**:
   - Push your branch to GitHub
   - Go to your repository on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template with:
     - Description of changes
     - Screenshots (if applicable)
     - Related issues
   - Assign reviewers

2. **Review Process**:
   - Reviewers provide feedback through comments
   - Make necessary changes based on feedback
   - Request re-review when changes are made

3. **Merging**:
   - Once approved, merge the pull request
   - Delete the branch after merging (optional)

## GitHub Actions for CI/CD

Set up automated workflows with GitHub Actions:

### 1. Basic CI Workflow

Create a file at `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Run linting
      run: npm run lint
```

### 2. Deployment Workflow

Create a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Render
      env:
        RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
      run: |
        curl -X POST https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys \
          -H "Authorization: Bearer $RENDER_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{}'
  
  deploy-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### 3. Set Up Secrets

1. **Go to Repository Settings**:
   - Click on "Settings" in your repository
   - Click on "Secrets and variables" > "Actions"

2. **Add Repository Secrets**:
   - `RENDER_API_KEY`: API key from Render
   - `RENDER_SERVICE_ID`: Your backend service ID
   - `VERCEL_TOKEN`: Token from Vercel
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## Collaborating Using GitHub Features

### 1. Project Boards

Set up a project board to track tasks:

1. **Create a Project Board**:
   - Go to the "Projects" tab in your repository
   - Click "New project"
   - Select "Board" as the template
   - Configure columns: "Todo", "In Progress", "Review", "Done"

2. **Add Issues to the Board**:
   - Create issues for features, bugs, and tasks
   - Add issues to the project board
   - Move issues across columns as work progresses

### 2. Issue Templates

Create issue templates for consistent reporting:

1. **Create Issue Templates**:
   - Create a directory: `.github/ISSUE_TEMPLATE`
   - Add template files:

2. **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.md`):
   ```markdown
   ---
   name: Feature request
   about: Suggest an idea for this project
   title: 'feat: '
   labels: enhancement
   assignees: ''
   ---

   ## Feature Description
   A clear and concise description of the feature you want.

   ## Use Case
   Explain when and how this feature would be useful.

   ## Proposed Solution
   If you have ideas about how to implement it, describe them here.

   ## Alternatives Considered
   Have you considered any alternative solutions or features?

   ## Additional Context
   Add any other context, screenshots, or sketches about the feature request.
   ```

3. **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.md`):
   ```markdown
   ---
   name: Bug report
   about: Create a report to help us improve
   title: 'bug: '
   labels: bug
   assignees: ''
   ---

   ## Bug Description
   A clear and concise description of what the bug is.

   ## To Reproduce
   Steps to reproduce the behavior:
   1. Go to '...'
   2. Click on '...'
   3. Scroll down to '...'
   4. See error

   ## Expected Behavior
   A clear and concise description of what you expected to happen.

   ## Screenshots
   If applicable, add screenshots to help explain your problem.

   ## Environment
   - Device: [e.g. Desktop, iPhone 12]
   - OS: [e.g. Windows 11, iOS 16]
   - Browser: [e.g. Chrome 112, Safari 16]
   - Version: [e.g. 1.0.0]

   ## Additional Context
   Add any other context about the problem here.
   ```

### 3. Pull Request Template

Create a PR template for consistent reviews:

1. **Create PR Template** (`.github/PULL_REQUEST_TEMPLATE.md`):
   ```markdown
   ## Description
   Brief description of the changes made.

   ## Related Issue
   Fixes #(issue number)

   ## Type of Change
   - [ ] Bug fix (non-breaking change that fixes an issue)
   - [ ] New feature (non-breaking change that adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to change)
   - [ ] UI/UX improvement
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe how you tested these changes.

   ## Checklist
   - [ ] My code follows the code style of this project
   - [ ] I have updated the documentation accordingly
   - [ ] I have added tests to cover my changes
   - [ ] All new and existing tests pass
   - [ ] The UI looks consistent in both light and dark mode

   ## Screenshots (if applicable)
   Add screenshots or GIFs to show the changes.
   ```

## Branch Protection and Code Review

Set up branch protection rules for quality control:

1. **Go to Repository Settings**:
   - Click on "Settings" in your repository
   - Click on "Branches" in the sidebar

2. **Add Branch Protection Rule**:
   - Click "Add rule"
   - Set "Branch name pattern" to `main`
   - Configure these options:
     - ✅ Require pull request reviews before merging
     - ✅ Require approvals (set to 1 or more)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Include administrators
   - Click "Create"

3. **Repeat for the develop branch** if needed, with potentially less strict settings

## Documentation on GitHub

### 1. GitHub Pages

Set up GitHub Pages to host your documentation:

1. **Go to Repository Settings**:
   - Click on "Settings" in your repository
   - Click on "Pages" in the sidebar

2. **Configure Source**:
   - Select "Deploy from a branch" as Source
   - Select the branch (main or gh-pages)
   - Select folder (/ (root) or /docs)
   - Click "Save"

### 2. GitHub Wikis

Create a wiki for detailed documentation:

1. **Go to the Wiki tab** in your repository
2. **Click "Create the first page"**
3. **Add sections**:
   - Home (overview)
   - Installation
   - Usage
   - API Documentation
   - Contributing Guidelines

### 3. GitHub README Profile

Create a professional README profile:

1. **Create a .github repository** with your GitHub username
2. **Add a README.md file** with information about yourself and your projects

---

By following this guide, you'll have a well-structured GitHub repository with proper version control practices, CI/CD workflows, and collaborative features. This will make it easier to maintain your E-ink Todo List Application and collaborate with others.
