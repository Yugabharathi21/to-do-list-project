import { format } from 'date-fns';
import { 
  Calendar, 
  Tag, 
  MoreVertical, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Circle,
  AlertCircle,
  ListChecks
} from 'lucide-react';

import { SubtaskList } from './SubtaskList';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  dueDate?: string;
  isOverdue: boolean;
  daysUntilDue: number | null;
  completionPercentage: number;
  subtasks: Array<{
    title: string;
    completed: boolean;
  }>;
  order: number;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: Task['status']) => void;
  onToggleSubtask: (taskId: string, subtaskIndex: number, completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, onToggleSubtask }: TaskCardProps) {
  // Removed unused variables and functions

  const handleStatusToggle = () => {
    if (task.status === 'completed') {
      onToggleStatus(task._id, 'pending');
    } else {
      onToggleStatus(task._id, 'completed');
    }
  };

  return (
    <Card className={cn(
      "bg-card border border-border/70 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-500 subtle-enter hover:shadow-md",
      task.isOverdue && task.status !== 'completed' && "border-destructive/40",
      task.status === 'completed' && "opacity-90 bg-background/80"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <button
              onClick={handleStatusToggle}
              className={cn(
                "mt-1.5 transition-all duration-500 opacity-90 hover:opacity-100",
                task.status === 'completed' ? "text-green-600 dark:text-green-400" : "text-muted-foreground hover:text-primary/80"
              )}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 checkbox-complete" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>              <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className={cn(
                  "font-serif font-medium text-lg task-title",
                  task.status === 'completed' && "completed"
                )}>
                  {task.title}
                </h3>
                
                {task.isOverdue && task.status !== 'completed' && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground mb-3.5 font-serif">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                <Badge className={cn(
                  "px-2 py-0.5 text-xs border rounded-sm font-serif font-medium",
                  task.priority === 'urgent' && "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60",
                  task.priority === 'high' && "border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/40 dark:text-orange-200 dark:hover:bg-orange-900/60",
                  task.priority === 'medium' && "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60",
                  task.priority === 'low' && "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60"
                )}>
                  {task.priority}
                </Badge>
                
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 border-border/40 bg-background/80 hover:bg-background dark:bg-background/40 dark:hover:bg-background/60 rounded-sm font-serif transition-colors duration-200">
                    <Tag className="h-3 w-3 mr-1 text-primary/70" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 text-xs font-serif text-muted-foreground mb-2.5">
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    {task.daysUntilDue !== null && (
                      <span className={cn(
                        "ml-1",
                        task.daysUntilDue < 0 ? "text-destructive" : 
                        task.daysUntilDue === 0 ? "text-foreground" : 
                        "text-muted-foreground"
                      )}>
                        ({task.daysUntilDue === 0 ? 'Today' : 
                          task.daysUntilDue < 0 ? `${Math.abs(task.daysUntilDue)} days overdue` :
                          `${task.daysUntilDue} days left`})
                      </span>
                    )}
                  </div>
                )}

                {task.subtasks.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <ListChecks className="h-3 w-3" />
                    <span>
                      {task.subtasks.filter(sub => sub.completed).length}/{task.subtasks.length} subtasks
                    </span>
                  </div>
                )}
              </div>

              {task.subtasks.length > 0 && (
                <SubtaskList
                  subtasks={task.subtasks}
                  taskId={task._id}
                  onToggleSubtask={onToggleSubtask}
                />
              )}
            </div>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="transition-all duration-500 hover:bg-muted/30 h-9 w-9 p-0 rounded-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-background border border-border/70 rounded-sm p-1 shadow-md">
                <DropdownMenuItem onClick={() => onEdit(task)} className="hover:bg-muted/50 py-2 cursor-pointer font-serif text-sm rounded-sm">
                  <Edit className="mr-2 h-3.5 w-3.5 text-primary/70" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(task._id)}
                  className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 py-2 cursor-pointer font-serif text-sm rounded-sm"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}