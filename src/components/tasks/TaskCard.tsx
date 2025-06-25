import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Tag, 
  MoreVertical, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Circle,
  AlertCircle
} from 'lucide-react';

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
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      case 'pending': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleStatusToggle = () => {
    if (task.status === 'completed') {
      onToggleStatus(task._id, 'pending');
    } else {
      onToggleStatus(task._id, 'completed');
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.isOverdue && task.status !== 'completed' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
      task.status === 'completed' && "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleStatusToggle}
              className={cn(
                "mt-1 transition-colors",
                getStatusColor(task.status)
              )}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={cn(
                  "font-medium text-gray-900 dark:text-white",
                  task.status === 'completed' && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                
                {task.isOverdue && task.status !== 'completed' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    {task.daysUntilDue !== null && (
                      <span className={cn(
                        "ml-1",
                        task.daysUntilDue < 0 ? "text-red-500" : 
                        task.daysUntilDue === 0 ? "text-orange-500" : 
                        "text-gray-500"
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
                    <Clock className="h-3 w-3" />
                    <span>
                      {task.subtasks.filter(sub => sub.completed).length}/{task.subtasks.length} subtasks
                    </span>
                  </div>
                )}
              </div>

              {task.subtasks.length > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(task._id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}