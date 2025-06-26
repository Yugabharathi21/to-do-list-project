import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AuthPage } from '@/components/auth/AuthPage';
import { Layout } from '@/components/layout/Layout';
import { TaskList } from '@/components/tasks/TaskList';
import { CalendarView } from '@/components/calendar/CalendarView';
import { NotesList } from '@/components/notes/NotesList';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { useAuthStore, useUIStore, useTaskStore } from '@/lib/store';
import { tasksAPI } from '@/lib/api';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { currentView } = useUIStore();
  const { setTaskStats } = useTaskStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTaskStats();
    }
  }, [isAuthenticated]);

  const fetchTaskStats = async () => {
    try {
      const response = await tasksAPI.getTaskStats();
      setTaskStats(response.data);
    } catch (error) {
      console.error('Failed to fetch task stats:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthPage />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskList />;
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NotesList />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <TaskList />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        {renderCurrentView()}
      </Layout>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;