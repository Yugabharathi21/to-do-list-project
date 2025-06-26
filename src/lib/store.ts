import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    defaultView: 'tasks' | 'calendar' | 'notes';
    taskSortBy: 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';
  };
  initials: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  dueDate?: string;
  completedAt?: string;
  user: string;
  order: number;
  subtasks: Array<{
    title: string;
    completed: boolean;
    completedAt?: string;
  }>;
  isOverdue: boolean;
  daysUntilDue: number | null;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  date: string;
  user: string;
  tags: string[];
  color: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  isPinned: boolean;
  linkedTasks: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  taskStats: any;
  filters: {
    status: string;
    priority: string;
    tag: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskStats: (stats: any) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  reorderTasks: (tasks: Task[]) => void;
}

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  noteFilters: {
    tag: string;
    color: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setNoteFilters: (filters: Partial<NoteState['noteFilters']>) => void;
}

interface UIState {
  currentView: 'tasks' | 'calendar' | 'notes' | 'profile';
  sidebarOpen: boolean;
  selectedDate: Date;
  setCurrentView: (view: 'tasks' | 'calendar' | 'notes' | 'profile') => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedDate: (date: Date) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      },
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Task Store
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  taskStats: {},
  filters: {
    status: 'all',
    priority: 'all',
    tag: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setTaskStats: (stats) => set({ taskStats: stats }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  reorderTasks: (tasks) => set({ tasks }),
}));

// Note Store
export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  selectedNote: null,
  noteFilters: {
    tag: '',
    color: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === id ? { ...note, ...updates } : note
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== id),
    })),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setNoteFilters: (filters) =>
    set((state) => ({ noteFilters: { ...state.noteFilters, ...filters } })),
}));

// UI Store
export const useUIStore = create<UIState>((set) => ({
  currentView: 'tasks',
  sidebarOpen: false,
  selectedDate: new Date(),
  setCurrentView: (view) => set({ currentView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));