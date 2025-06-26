import axios from 'axios';

const API_BASE_URL = 'https://to-do-list-project-b0tu.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; avatar?: string; preferences?: any }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  
  logout: () => api.post('/auth/logout'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params?: any) => api.get('/tasks', { params }),
  
  getTaskStats: () => api.get('/tasks/stats'),
  
  getTask: (id: string) => api.get(`/tasks/${id}`),
  
  createTask: (taskData: any) => api.post('/tasks', taskData),
  
  updateTask: (id: string, taskData: any) => api.put(`/tasks/${id}`, taskData),
  
  updateTaskOrder: (id: string, newOrder: number) =>
    api.put(`/tasks/${id}/order`, { newOrder }),
  
  bulkReorderTasks: (taskOrders: { id: string }[]) =>
    api.put('/tasks/bulk/reorder', { taskOrders }),
  
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  
  bulkDeleteTasks: (taskIds: string[]) =>
    api.delete('/tasks/bulk/delete', { data: { taskIds } }),
};

// Notes API
export const notesAPI = {
  getNotes: (params?: any) => api.get('/notes', { params }),
  
  getNote: (id: string) => api.get(`/notes/${id}`),
  
  createNote: (noteData: any) => api.post('/notes', noteData),
  
  updateNote: (id: string, noteData: any) => api.put(`/notes/${id}`, noteData),
  
  togglePin: (id: string) => api.patch(`/notes/${id}/pin`),
  
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
  
  bulkDeleteNotes: (noteIds: string[]) =>
    api.delete('/notes/bulk/delete', { data: { noteIds } }),
};

export default api;