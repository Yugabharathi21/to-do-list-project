import { CheckSquare, Calendar, FileText, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore, useTaskStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useUIStore();
  const { taskStats } = useTaskStore();

  const menuItems = [
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: taskStats.pending || 0,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  const handleViewChange = (view: 'tasks' | 'calendar' | 'notes') => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 glass-sidebar border-r border-white/10 dark:border-white/5 transform transition-transform duration-300 ease-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              TaskFlow
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-lift",
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white backdrop-blur-sm"
                      : "text-neutral-700 hover:bg-black/[0.03] dark:text-neutral-300 dark:hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick stats */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
              <span className="font-medium">{taskStats.total || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="font-medium text-green-600">{taskStats.completed || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Overdue</span>
              <span className="font-medium text-red-600">{taskStats.overdue || 0}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}