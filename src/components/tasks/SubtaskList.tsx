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
    <div className="mt-4 pt-3 border-t border-border/40">
      <button 
        onClick={toggleExpand}
        className="w-full flex items-center text-sm hover:text-foreground transition-all duration-500 bg-transparent py-2.5 px-1.5 rounded-sm hover:bg-background/70"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-foreground" />
        )}
        <span className="font-serif font-medium ml-1.5">
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-700 rounded-full",
                progress === 100 
                  ? "bg-green-500/60 dark:bg-green-400/60" 
                  : progress > 50
                    ? "bg-primary/70 dark:bg-primary/60"
                    : "bg-muted-foreground/70"
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="min-w-[2.5rem] text-right text-xs font-medium">{progress}%</span>
        </div>
      </button>
      
      {expanded && (
        <div className="mt-4 ml-5 space-y-3 subtle-enter">
          {subtasks.map((subtask, index) => (
            <div 
              key={subtask._id || index} 
              className="flex items-center group p-1 -ml-1 rounded-sm hover:bg-background/50 transition-colors duration-200"
            >
              <button
                onClick={() => handleToggleSubtask(index, subtask.completed)}
                className={cn(
                  "flex items-center w-full text-sm font-serif transition-all duration-500",
                  subtask.completed 
                    ? "text-muted-foreground" 
                    : "text-foreground"
                )}
              >
                {subtask.completed ? (
                  <CheckCircle className={cn("h-4 w-4 mr-3 checkbox-complete text-primary/80")} />
                ) : (
                  <Circle className="h-4 w-4 mr-3 text-muted-foreground/70" />
                )}
                <span className={cn(
                  "subtask-title",
                  subtask.completed && "completed"
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
