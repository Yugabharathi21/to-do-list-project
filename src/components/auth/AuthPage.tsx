import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { CheckSquare, Calendar, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - App preview */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Stay Organized, Stay Productive
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your tasks, plan your days, and capture your thoughts all in one place.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-border/50">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Task Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Create, organize, and track your tasks with priorities and due dates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-border/50">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Calendar Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View your tasks and deadlines in a beautiful calendar view</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-border/50">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Capture ideas and link them to specific dates and tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-border/50 dark:border-border/30">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to get started'}
            </p>
          </div>
          
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}