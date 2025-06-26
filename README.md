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
