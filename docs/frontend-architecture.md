# Frontend Architecture and Development Guide

This document provides comprehensive information about the frontend architecture, component structure, state management, and development workflow for the E-ink Inspired Todo List Application.

## 🛠️ Frontend Technology Stack

- **React 18**: UI library with hooks and functional components
- **TypeScript**: Statically typed JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library based on Radix UI
- **Zustand**: State management library
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation library
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notifications
- **Next-themes**: Theme handling (dark/light mode)
- **date-fns**: Date manipulation library
- **React Beautiful DnD**: Drag and drop functionality
- **Recharts**: Charts and data visualization
- **Lucide React**: Icon library

## 🏗️ Architecture Overview

The frontend application follows a component-based architecture with these key principles:

1. **Component Modularity**: Each component has a single responsibility
2. **State Management**: Using Zustand for global state
3. **Custom Hooks**: Abstracting reusable logic
4. **E-ink Design System**: Consistent styling based on e-ink aesthetics
5. **Responsive Design**: Works on all screen sizes

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── vite-env.d.ts              # Vite type declarations
├── index.css                  # Global styles
│
├── components/                # UI components
│   ├── auth/                  # Authentication components
│   │   ├── AuthPage.tsx       # Auth page container
│   │   ├── AuthMenu.tsx       # Auth dialog
│   │   ├── LoginForm.tsx      # Login form
│   │   └── RegisterForm.tsx   # Registration form
│   │
│   ├── calendar/              # Calendar views
│   │   └── CalendarView.tsx   # Calendar component
│   │
│   ├── layout/                # Layout components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   └── Sidebar.tsx        # Side navigation menu
│   │
│   ├── notes/                 # Note components
│   │   ├── NoteCard.tsx       # Individual note display
│   │   ├── NoteForm.tsx       # Note creation/editing form
│   │   └── NotesList.tsx      # Notes list view
│   │
│   ├── profile/               # User profile components
│   │   └── ProfilePage.tsx    # User profile page
│   │
│   ├── tasks/                 # Task-related components
│   │   ├── SubtaskList.tsx    # Subtasks list
│   │   ├── TaskCard.tsx       # Individual task card
│   │   ├── TaskFilters.tsx    # Task filtering controls
│   │   ├── TaskForm.tsx       # Task creation/editing form
│   │   └── TaskList.tsx       # Tasks list view
│   │
│   └── ui/                    # Shadcn UI components
│       ├── button.tsx         # Button component
│       ├── input.tsx          # Input component
│       └── ... (many more)    # Other UI components
│
├── hooks/                     # Custom hooks
│   ├── use-toast.ts           # Toast notifications hook
│   └── use-custom-toast.ts    # Enhanced toast hook
│
└── lib/                       # Utilities and services
    ├── api.ts                 # API client
    ├── store.ts               # Zustand store
    └── utils.ts               # Utility functions
```

## 🎨 Design System and Styling

### Theme Implementation

The application uses a custom e-ink inspired design with dual themes (light and dark):

- **Light Theme**: Clean, paper-like background with subtle texture and high contrast
- **Dark Theme**: Soft, eye-friendly dark mode with proper contrast

Theme switching is handled via `next-themes` and customized using Tailwind CSS.

### Design Tokens

Key design tokens defined in Tailwind configuration:

```javascript
// tailwind.config.js (simplified)
module.exports = {
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        // ... more color variables
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      // ... other design tokens
    },
  },
};
```

### Components and Styling

Components use a combination of:

1. **Tailwind Classes**: For most styling needs
2. **CSS Variables**: For theming and dynamic values
3. **Shadcn UI**: For base component styling
4. **Custom CSS**: For specific effects like the e-ink paper texture

## 🔄 State Management with Zustand

The application uses Zustand for state management, divided into three main stores:

### Auth Store

```typescript
// Simplified example
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (userData) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null
    })),
}));
```

### UI Store

```typescript
// Simplified example
interface UIState {
  currentView: 'tasks' | 'calendar' | 'notes' | 'profile';
  sidebarOpen: boolean;
  setCurrentView: (view: UIState['currentView']) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'tasks',
  sidebarOpen: false,
  setCurrentView: (view) => set({ currentView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

### Task Store

```typescript
// Simplified example
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  taskStats: TaskStats | null;
  filter: TaskFilter;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskStats: (stats: TaskStats) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  taskStats: null,
  filter: { status: 'all', priority: 'all', sort: 'dueDate', order: 'asc' },
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  // ... other actions
}));
```

## 📡 API Integration

API requests are centralized in the `api.ts` module using Axios:

```typescript
// Simplified example
import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Tasks API
export const tasksAPI = {
  getTasks: (filters) => api.get('/tasks', { params: filters }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, updates) => api.put(`/tasks/${id}`, updates),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskStats: () => api.get('/tasks/stats'),
};

// Notes API
export const notesAPI = {
  getNotes: () => api.get('/notes'),
  createNote: (note) => api.post('/notes', note),
  updateNote: (id, updates) => api.put(`/notes/${id}`, updates),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};
```

## 🔐 Authentication Flow

1. **User Registration/Login**
   - Form data validation with React Hook Form + Zod
   - API request to auth endpoints
   - JWT token and user data stored in AuthStore

2. **Protected Routes**
   - App.tsx checks `isAuthenticated` from AuthStore
   - Redirects to AuthPage if not authenticated

3. **API Requests Authentication**
   - Axios interceptor adds JWT token to all API requests
   - API responses update state via Zustand stores

## 📝 Form Handling with React Hook Form and Zod

Forms use React Hook Form with Zod schemas for validation:

```typescript
// Example schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['not-started', 'in-progress', 'completed']),
});

// Form component (simplified)
function TaskForm({ onSubmit }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { 
      priority: 'medium',
      status: 'not-started' 
    }
  });
  
  const processSubmit = (data) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      {/* Form fields... */}
    </form>
  );
}
```

## 🔔 Notification System

Notifications use Sonner toast with custom styling and a custom hook:

```typescript
// Example usage of custom toast
import { useCustomToast } from '@/hooks/use-custom-toast';

function TaskActions() {
  const toast = useCustomToast();
  
  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };
}
```

## 📱 Responsive Design Approach

The application uses a mobile-first approach with responsive components:

1. **Breakpoints**: Standard Tailwind breakpoints (sm, md, lg, xl)
2. **Layout Strategy**: 
   - Mobile: Full-width, stacked layout
   - Tablet: Two-column layout
   - Desktop: Sidebar + content layout
3. **Component Adaptations**: Components adjust their layout based on screen size

## 🧪 Development Workflow

### Setting Up the Development Environment

1. **Clone the repo and install dependencies**
   ```bash
   git clone https://github.com/yourusername/e-ink-todo-app.git
   cd e-ink-todo-app
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

### Development Practices

1. **Component Development Pattern**
   - Create small, focused components
   - Use TypeScript interfaces for props
   - Add proper comments and documentation

2. **Adding a New Feature**
   - Create necessary components in appropriate directories
   - Update store if needed with new state/actions
   - Add API integration if required
   - Update routing/navigation if necessary

3. **Styling and Theme Guidelines**
   - Follow the e-ink aesthetic
   - Ensure both light and dark themes work properly
   - Use Tailwind utility classes consistently
   - Maintain accessibility standards

### Component Creation Example

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { taskAPI } from '@/lib/api';
import { useTaskStore } from '@/lib/store';
import { toast } from 'sonner';

/**
 * TaskActions component provides action buttons for manipulating tasks
 */
export function TaskActions({ task }) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteTask } = useTaskStore();
  
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await taskAPI.deleteTask(task.id);
      deleteTask(task.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="destructive" 
        size="sm"
        disabled={isLoading}
        onClick={handleDelete}
      >
        Delete
      </Button>
      {/* Additional buttons... */}
    </div>
  );
}
```

## 🚀 Building and Deploying

### Building for Production

```bash
npm run build
```

This creates optimized production files in the `dist` directory.

### Deployment Checklist

1. **Environment Configuration**
   - Set correct API URL in `.env` files
   - Check for any hardcoded URLs or paths

2. **Bundle Size Optimization**
   - Use dynamic imports for large components
   - Ensure proper code splitting
   - Check final bundle size with `npm run build`

3. **Cross-browser Testing**
   - Test in Chrome, Firefox, Safari, and Edge
   - Test on mobile devices (iOS and Android)

## 🔍 Troubleshooting Common Frontend Issues

### State Management Issues

**Problem**: Components not updating when state changes
**Solution**: 
- Ensure you're using state selectors correctly
- Check if the component is memoized unnecessarily
- Verify the state is actually changing in the store

### Styling and Theme Issues

**Problem**: Dark mode styles not applying correctly
**Solution**:
- Check that className includes proper dark: variants
- Ensure the ThemeProvider is wrapping all components
- Verify CSS variables in `:root` and `.dark` selectors

### API Integration Issues

**Problem**: API calls failing or returning unexpected data
**Solution**:
- Check network requests in browser DevTools
- Verify API endpoints and request format
- Ensure authentication token is being sent correctly

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [Zod Documentation](https://zod.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)

## 🤝 Contributing Guidelines

1. **Branch naming convention**: `feature/feature-name` or `fix/issue-description`
2. **Commit messages**: Follow conventional commits format
3. **Pull requests**: Include detailed descriptions and reference issues
4. **Code style**: Follow ESLint rules and project conventions
5. **Testing**: Add or update tests for new features

---

Document last updated: June 26, 2025