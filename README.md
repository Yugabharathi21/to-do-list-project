# E-ink Inspired Todo List Application

A modern, professional task management application with a beautiful e-ink inspired design theme. This full-stack MERN (MongoDB, Express, React, Node.js) application provides comprehensive task management capabilities with an emphasis on accessibility, readability, and a clean user interface.

![E-ink Inspired Todo App](https://i.imgur.com/yourscreenshot.png)

## 📋 Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, update, delete, and organize tasks
- **Subtasks Support**: Break down tasks into smaller, manageable subtasks
- **Priority System**: Color-coded priority tags for visual organization
- **Calendar View**: Visualize tasks on a calendar interface
- **Notes**: Create and manage notes alongside tasks
- **Dark/Light Mode**: E-ink inspired themes for both modes
- **Responsive Design**: Works on desktop and mobile devices
- **Profile Management**: Update user information

## 🛠️ Technologies Used

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library based on Radix UI
- **Lucide React**: Beautiful, customizable icons
- **Zustand**: Simple state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation library
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notifications
- **next-themes**: Theme handling
- **date-fns**: Date manipulation library
- **React Beautiful DnD**: Drag and drop functionality

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JSON Web Token (JWT)**: Authentication
- **Bcrypt.js**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: Rate limiting middleware
- **dotenv**: Environment variable management

## 💻 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Environment Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/e-ink-todo-app.git
cd e-ink-todo-app
```

2. Create environment variables
   
Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Installation

1. Install dependencies
```bash
npm install
```

2. Run the application in development mode
```bash
npm run dev
```

This will start both the backend server (port 5000) and the frontend client (port 5173) concurrently.

### Building for Production

```bash
npm run build
```

This will create a production build of the frontend in the `dist` directory.

## 🚀 Deployment

### Step-by-Step Deployment Guide

#### 1. Preparing Your Application for Production

Before deploying, ensure your application is properly configured:

1. Update your API URL in the frontend:
   - Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
   - Make sure your `api.ts` uses this environment variable:
   ```typescript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   });
   ```

2. Update your CORS settings in the backend:
   ```javascript
   // server/index.js
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? process.env.CLIENT_URL 
       : 'http://localhost:5173',
     credentials: true
   }));
   ```

#### 2. Backend Deployment on Render

1. **Create a MongoDB Atlas Database**:
   - Sign up/login at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is sufficient)
   - Create a database user with read/write permissions
   - Get your connection string by clicking "Connect" > "Connect your application"
   - Replace `<password>` with your database user's password

2. **Deploy the Backend to Render**:
   - Sign up/login at [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `e-ink-todo-backend` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server/index.js`
     - **Environment Variables**:
       - `MONGODB_URI`: Your MongoDB Atlas connection string
       - `JWT_SECRET`: A secure random string for JWT signing
       - `NODE_ENV`: `production`
       - `CLIENT_URL`: Your Vercel frontend URL (to be created in next step, can update later)
       - `PORT`: `10000` (Render will override this, but it's good to set)
   - Click "Create Web Service"

3. **Verify Backend Deployment**:
   - Once deployed, Render will provide a URL like `https://e-ink-todo-backend.onrender.com`
   - Test the health endpoint by visiting `https://e-ink-todo-backend.onrender.com/api/health`
   - You should see a JSON response with status "OK"

#### 3. Frontend Deployment on Vercel

1. **Prepare Your Frontend**:
   - Commit any uncommitted changes to your repository
   - Ensure your repository is pushed to GitHub

2. **Deploy to Vercel**:
   - Sign up/login at [Vercel](https://vercel.com/)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `./` (if your package.json is in the root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Environment Variables**:
       - `VITE_API_URL`: Your Render backend URL with `/api` (e.g., `https://e-ink-todo-backend.onrender.com/api`)
   - Click "Deploy"

3. **Update CORS Settings on Backend**:
   - Go back to your Render dashboard
   - Find your backend service and click on it
   - Go to "Environment" and update `CLIENT_URL` to your new Vercel URL (e.g., `https://e-ink-todo.vercel.app`)
   - Click "Save Changes" and Render will automatically redeploy your backend

#### 4. Verify Full Application Deployment

1. Visit your Vercel URL
2. Test the application by:
   - Creating an account
   - Logging in
   - Creating and managing tasks
   - Ensuring all features work correctly

#### 5. CI/CD Setup (Optional)

Both Vercel and Render offer continuous deployment by default:

- **Vercel**: Automatically deploys when you push changes to the main branch
- **Render**: Automatically deploys when you push changes to the connected branch

To disable automatic deployments:
- On Vercel: Project Settings > Git > Deploy Hooks > Toggle "Enable Auto Deployments"
- On Render: Service Settings > Auto-Deploy > Toggle "Suspend Auto-Deploy"

### Troubleshooting Deployment Issues

#### CORS Issues
If you're experiencing CORS issues:
1. Double check the `CLIENT_URL` on Render matches your Vercel URL exactly
2. Ensure your API requests include `/api` in the URL
3. Check browser console for specific CORS error details

#### MongoDB Connection Issues
If the backend can't connect to MongoDB:
1. Verify your MongoDB Atlas connection string
2. Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allows connections from anywhere)
3. Check if your database user has the correct permissions

#### 404 Errors on Page Refresh
For client-side routing issues:
1. Create a `vercel.json` file in your project root:
   ```json
   {
     "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
   }
   ```
2. Commit and push this file to your repository
3. Redeploy on Vercel

### Production Monitoring (Optional)

Consider setting up monitoring for your deployed application:

1. **Backend Monitoring**: 
   - Use [Sentry](https://sentry.io) or [LogRocket](https://logrocket.com) for error tracking
   - Implement logging with a service like [Logtail](https://logtail.com)

2. **Frontend Monitoring**:
   - Add Google Analytics or [Plausible](https://plausible.io) for user analytics
   - Implement error boundary components in React

### Backend Deployment (Render, Heroku, or similar)

1. Create a new web service
2. Link your GitHub repository
3. Configure the following:
   - Build Command: None (or `npm install` if needed)
   - Start Command: `node server/index.js`
   - Environment Variables: Set the same variables as in your .env file

### Frontend Deployment (Netlify, Vercel, or similar)

1. Create a new site from your repository
2. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables: Set `VITE_API_URL` to your backend URL

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Set up a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and use it in your environment variables

## 📁 Project Structure

```
├── server/                 # Backend code
│   ├── index.js            # Server entry point
│   ├── .env                # Environment variables (create this)
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Note.js
│   └── routes/             # API routes
│       ├── auth.js         # Authentication routes
│       ├── tasks.js        # Task management routes
│       └── notes.js        # Note management routes
├── src/                    # Frontend code
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── tasks/          # Task-related components
│   │   ├── notes/          # Note-related components
│   │   ├── calendar/       # Calendar components
│   │   ├── layout/         # Layout components
│   │   ├── profile/        # User profile components
│   │   └── ui/             # Shadcn UI components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities and services
│       ├── api.ts          # API client
│       ├── store.ts        # Zustand store
│       └── utils.ts        # Utility functions
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🖌️ Theming and UI

The application features a custom e-ink inspired design theme with:

- Professional, readable typography using system fonts optimized for screen readability
- Modern color palette with high contrast for better readability
- Clean, minimal UI with proper spacing and alignment
- Paper texture background in the e-ink theme
- Responsive design for all screen sizes

### Dark/Light Mode Toggle

The theme can be toggled between light and dark mode using the theme toggle button in the navbar or on the login page. The theme preference is stored in local storage.

## 🔒 Authentication Flow

1. User registers with name, email, and password
2. Credentials are validated and password is hashed before storage
3. JWT token is generated and returned to the client
4. Token is stored in memory (not in cookies/local storage for security)
5. Protected routes check for valid token
6. Logout clears the token from memory

## 🔄 State Management

The application uses Zustand for state management, organized into separate stores:
- `authStore`: Manages user authentication state
- `taskStore`: Manages tasks and task-related state
- `uiStore`: Manages UI-related state (sidebar, current view, etc.)

## 🛣️ API Routes

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user
- `GET /api/auth/profile`: Get user profile

### Tasks
- `GET /api/tasks`: Get all tasks for the current user
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/:id`: Get a specific task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task
- `POST /api/tasks/:id/subtasks`: Add a subtask
- `GET /api/tasks/stats`: Get task statistics

### Notes
- `GET /api/notes`: Get all notes for the current user
- `POST /api/notes`: Create a new note
- `PUT /api/notes/:id`: Update a note
- `DELETE /api/notes/:id`: Delete a note

## 🧪 Future Improvements

- Unit and integration tests
- PWA support for offline functionality
- Collaborative features for team task management
- Advanced filtering and search capabilities
- Email notifications and reminders
- Data export/import functionality
- Mobile applications using React Native

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the wonderful component library
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- All the open-source libraries and tools that made this project possible

## 📧 Contact

For questions or support, please open an issue on the GitHub repository or contact the maintainers directly.

---

Made with ❤️ by [Your Name]
