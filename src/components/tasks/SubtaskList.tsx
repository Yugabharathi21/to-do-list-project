import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: Subtask[];
  taskId: string;
  onToggleSubtask: (taskId: string, subtaskIndex: number, completed: boolean) => void;
}

export function SubtaskList({ subtasks, taskId, onToggleSubtask }: SubtaskListProps) {
  const [expanded, setExpanded] = useState(false);

  if (subtasks.length === 0) {
    return null;
  }

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleToggleSubtask = (index: number, currentState: boolean) => {
    onToggleSubtask(taskId, index, !currentState);
  };

  const completedCount = subtasks.filter(subtask => subtask.completed).length;
  const progress = Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
      <button 
        onClick={toggleExpand}
        className="w-full flex items-center text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 mr-1" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 mr-1" />
        )}
        <span className="font-medium">
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300",
                progress === 100 
                  ? "bg-green-500 dark:bg-green-600" 
                  : "bg-blue-500 dark:bg-blue-600"
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="min-w-[2rem] text-right">{progress}%</span>
        </div>
      </button>
      
      {expanded && (
        <div className="mt-2 ml-4 space-y-1.5 animate-in fade-in-50 duration-150">
          {subtasks.map((subtask, index) => (
            <div 
              key={subtask._id || index} 
              className="flex items-center group"
            >
              <button
                onClick={() => handleToggleSubtask(index, subtask.completed)}
                className={cn(
                  "flex items-center text-xs transition-all duration-300 transform hover:scale-105 group-hover:opacity-100",
                  subtask.completed 
                    ? "text-green-600 dark:text-green-500" 
                    : "text-neutral-400 dark:text-neutral-500 opacity-80"
                )}
              >
                {subtask.completed ? (
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5 mr-1.5" />
                )}
                <span className={cn(
                  "text-neutral-700 dark:text-neutral-300",
                  subtask.completed && "line-through text-neutral-500 dark:text-neutral-500"
                )}>
                  {subtask.title}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
