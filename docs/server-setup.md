# Server Setup and Configuration Guide

This document provides detailed instructions for setting up and configuring the server for the E-ink Todo List Application.

## 🛠️ Server Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Token for authentication
- **Bcrypt**: Password hashing library
- **Helmet**: Security middleware for Express
- **CORS**: Cross-Origin Resource Sharing middleware
- **Express Rate Limit**: Rate limiting middleware
- **dotenv**: Environment variable management

## 📋 Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- MongoDB (local installation or Atlas cloud account)
- Git

## 🚀 Local Development Setup

### Step 1: Configure Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todo-app
# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRY=7d

# Client URL for CORS
CLIENT_URL=http://localhost:5173
```

### Step 2: Install Dependencies

From the project root directory:

```bash
npm install
```

### Step 3: Start the Development Server

```bash
# Start both frontend and backend with concurrently
npm run dev

# OR start just the backend
npm run server
```

The server will start on `http://localhost:5000` or the port specified in your environment variables.

### Step 4: Initialize the Database (Optional)

If you want to populate the database with some initial data:

```bash
npm run init-db
```

## 🐳 Docker Setup (Optional)

### Step 1: Create a Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "server"]
```

### Step 2: Create a docker-compose.yml File

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    environment:
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/todo-app
      - JWT_SECRET=your_super_secure_jwt_secret
      - NODE_ENV=development
      - CLIENT_URL=http://localhost:5173

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Step 3: Run with Docker Compose

```bash
docker-compose up -d
```

## 🔒 Security Best Practices

The server implements several security measures:

1. **Helmet Middleware**: Sets various HTTP headers for security
2. **Rate Limiting**: Prevents abuse by limiting request frequency
3. **Password Hashing**: Using bcrypt with appropriate salt rounds
4. **JWT Authentication**: Securely authenticates API requests
5. **CORS Configuration**: Restricts access to the API
6. **Input Validation**: Validates all incoming requests

## 🌐 API Documentation

### Authentication Endpoints

#### Register a New User

```
POST /api/auth/register
```

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login a User

```
POST /api/auth/login
```

Request Body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get User Profile

```
GET /api/auth/profile
```

Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Update User Profile

```
PUT /api/auth/profile
```

Headers:
```
Authorization: Bearer jwt_token_here
```

Request Body:
```json
{
  "name": "John Smith"
}
```

Response:
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Smith",
    "email": "john@example.com"
  }
}
```

### Task Endpoints

All task endpoints require authentication with the Authorization header.

#### Get All Tasks

```
GET /api/tasks
```

Query Parameters:
- `status`: Filter by status (optional)
- `priority`: Filter by priority (optional)
- `sort`: Sort field (optional)
- `order`: Sort order (asc/desc, optional)

Response:
```json
{
  "tasks": [
    {
      "_id": "task_id",
      "title": "Complete project",
      "description": "Finish the todo app project",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-07-01T00:00:00.000Z",
      "subtasks": [...]
    },
    ...
  ]
}
```

#### Create a Task

```
POST /api/tasks
```

Request Body:
```json
{
  "title": "New task",
  "description": "Description here",
  "status": "not-started",
  "priority": "medium",
  "dueDate": "2025-07-15"
}
```

#### Get Task Details

```
GET /api/tasks/:id
```

#### Update a Task

```
PUT /api/tasks/:id
```

Request Body:
```json
{
  "title": "Updated task title",
  "status": "completed"
}
```

#### Delete a Task

```
DELETE /api/tasks/:id
```

#### Get Task Statistics

```
GET /api/tasks/stats
```

Response:
```json
{
  "totalTasks": 10,
  "completedTasks": 3,
  "inProgressTasks": 5,
  "notStartedTasks": 2,
  "highPriorityTasks": 4
}
```

### Note Endpoints

All note endpoints require authentication with the Authorization header.

#### Get All Notes

```
GET /api/notes
```

#### Create a Note

```
POST /api/notes
```

Request Body:
```json
{
  "title": "Meeting notes",
  "content": "Content of the note here..."
}
```

#### Get Note Details

```
GET /api/notes/:id
```

#### Update a Note

```
PUT /api/notes/:id
```

#### Delete a Note

```
DELETE /api/notes/:id
```

## 🚀 Deployment Guide

### Deploying to Render

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the branch to deploy

2. **Configure the Web Service**
   - **Name:** Your service name
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`

3. **Add Environment Variables**
   - Add all the variables from your `.env` file

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete

### Deploying to Heroku

1. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB Add-on (or use MongoDB Atlas)**
   ```bash
   heroku addons:create mongodb
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=your_frontend_url
   ```

4. **Deploy the Code**
   ```bash
   git push heroku main
   ```

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Sign up at https://www.mongodb.com/cloud/atlas

2. **Create a New Cluster**
   - Choose the free tier option
   - Select a cloud provider and region

3. **Configure Network Access**
   - Add your IP address or use `0.0.0.0/0` to allow access from anywhere

4. **Create a Database User**
   - Username and password for your application

5. **Get Your Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your database user's password

## 🔄 Continuous Integration/Deployment

### GitHub Actions Workflow

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
      
    - name: Deploy to Render
      env:
        RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
      run: |
        curl -X POST https://api.render.com/v1/deploys \
          -H "Authorization: Bearer $RENDER_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"serviceId":"your-render-service-id"}'
```

## 🔍 Troubleshooting Common Issues

### Connection to MongoDB fails

1. Check if your MongoDB service is running
2. Verify your connection string in the .env file
3. Ensure network access is configured properly if using Atlas
4. Check for any authentication issues in your MongoDB user

### JWT Authentication Issues

1. Ensure the JWT_SECRET is properly set
2. Check that the token is being sent in the Authorization header
3. Verify token expiration settings

### CORS Errors

1. Make sure the CLIENT_URL in .env matches your frontend URL
2. Check CORS configuration in server/index.js
3. Verify that requests include the correct headers

## 🤝 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

Document last updated: June 26, 2025