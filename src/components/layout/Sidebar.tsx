import { CheckSquare, Calendar, FileText, BarChart3, X, CheckCircle2 } from 'lucide-react';
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
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 z-50 bg-card border-r border-border/60",
          "transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:static md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "overflow-y-auto pb-10 pt-3"
        )}
      >
        <div className="px-4 mb-8 flex items-center justify-between">
          <div className="app-logo">
            <div className="flex items-center justify-center h-8 w-8 bg-background rounded-sm border border-border/80 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <span className="app-logo-text">
                <span className="font-display text-primary">E</span>-Tasks
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden rounded-sm hover:bg-accent dark:hover:bg-accent/40"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start rounded-sm h-11 px-4 mb-1 transition-all duration-300",
                "hover:bg-accent dark:hover:bg-accent/40 font-body text-sm",
                currentView === item.id
                  ? "bg-secondary/70 text-foreground font-medium"
                  : "text-muted-foreground"
              )}
              onClick={() => handleViewChange(item.id as any)}
            >
              <item.icon className={cn("h-4 w-4 mr-3", currentView === item.id ? "text-primary" : "text-muted-foreground")} />
              <span className="flex-1 text-left">{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "ml-auto text-xs py-0.5 h-5 min-w-[20px] flex items-center justify-center",
                    "border-border/60 bg-background/80 font-mono",
                    currentView === item.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="mt-8 px-4">
          <div className="p-3 bg-muted rounded-sm border border-border/40">
            <h4 className="font-heading text-sm font-medium mb-2">Task Progress</h4>
            <div className="text-xs font-body text-muted-foreground mb-2">
              {taskStats.completed || 0} of {(taskStats.pending || 0) + (taskStats.completed || 0)} tasks completed
            </div>
            <div className="progress-bar h-2 rounded-sm overflow-hidden bg-border/30">
              <div 
                className="progress-bar-fill bg-primary transition-all duration-300" 
                style={{ 
                  width: `${taskStats.pending + taskStats.completed > 0 
                    ? (taskStats.completed / (taskStats.pending + taskStats.completed)) * 100 
                    : 0}%` 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
