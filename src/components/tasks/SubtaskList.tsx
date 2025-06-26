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
        className="w-full flex items-center text-xs hover:text-foreground transition-all duration-500 bg-transparent py-2 rounded-sm hover:bg-background"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-foreground" />
        )}
        <span className="font-serif font-medium ml-1">
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        
        <div className="ml-auto flex items-center space-x-3">
          <div className="w-20 h-1 bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-700",
                progress === 100 
                  ? "bg-foreground" 
                  : "bg-muted-foreground"
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="min-w-[2rem] text-right text-2xs">{progress}%</span>
        </div>
      </button>
      
      {expanded && (
        <div className="mt-3 ml-4 space-y-1.5 subtle-enter">
          {subtasks.map((subtask, index) => (
            <div 
              key={subtask._id || index} 
              className="flex items-center group"
            >
              <button
                onClick={() => handleToggleSubtask(index, subtask.completed)}
                className={cn(
                  "flex items-center w-full text-2xs font-serif transition-all duration-500",
                  subtask.completed 
                    ? "text-muted-foreground" 
                    : "text-foreground"
                )}
              >
                {subtask.completed ? (
                  <CheckCircle className={cn("h-3 w-3 mr-2 checkbox-complete")} />
                ) : (
                  <Circle className="h-3 w-3 mr-2" />
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
