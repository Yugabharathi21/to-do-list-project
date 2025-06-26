import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  dueDate?: string;
  subtasks: Array<{
    title: string;
    completed: boolean;
  }>;
}

interface TaskFormProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function TaskForm({ task, open, onOpenChange, onSubmit, isLoading }: TaskFormProps) {
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      tags: task?.tags || [],
    },
  });

  const dueDate = watch('dueDate');

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      tags,
      subtasks,
      dueDate: data.dueDate?.toISOString(),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setSubtasks([]);
    setNewTag('');
    setNewSubtask('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-5 bg-background border border-border/50 rounded-sm shadow-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {task ? 'Edit Task' : 'New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-3">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-serif">Task Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter task title"
              className={cn("h-10 text-base px-3 font-serif bg-background border-border/60 rounded-sm", 
                errors.title ? 'border-destructive/70' : '')}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-serif">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-serif">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter task description (optional)"
              rows={4}
              className="min-h-[90px] text-sm px-3 py-2.5 font-serif bg-background border-border/60 rounded-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-serif">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value: any) => setValue('priority', value)}
              >
                <SelectTrigger className="h-10 bg-background border-border/60 rounded-sm font-serif text-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border/60 rounded-sm font-serif">
                  <SelectItem value="low" className="py-2 hover:bg-muted/30">Low</SelectItem>
                  <SelectItem value="medium" className="py-2 hover:bg-muted/30">Medium</SelectItem>
                  <SelectItem value="high" className="py-2 hover:bg-muted/30">High</SelectItem>
                  <SelectItem value="urgent" className="py-2 hover:bg-muted/30">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-serif">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-10 bg-background border-border/60 rounded-sm font-serif text-sm",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-border/60 rounded-sm" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => setValue('dueDate', date)}
                    initialFocus
                    className="font-serif"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-serif">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs bg-background border border-border/50 rounded-sm font-serif">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="h-10 bg-background border-border/60 rounded-sm font-serif text-sm"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button 
                type="button" 
                onClick={addTag} 
                className="h-10 px-3 bg-background hover:bg-muted/30 text-foreground border border-border/70 rounded-sm transition-colors duration-500"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-serif">Subtasks</Label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/20 border border-border/30 rounded-sm">
                  <span className="text-xs font-serif">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors duration-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask"
                className="h-10 bg-background border-border/60 rounded-sm font-serif text-sm"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <Button 
                type="button" 
                onClick={addSubtask} 
                className="h-10 px-3 bg-background hover:bg-muted/30 text-foreground border border-border/70 rounded-sm transition-colors duration-500"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 px-4 text-sm font-serif bg-background border-border/60 rounded-sm hover:bg-muted/30 transition-colors duration-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-10 px-4 text-sm font-serif bg-foreground text-background border-0 rounded-sm hover:bg-foreground/90 transition-colors duration-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}