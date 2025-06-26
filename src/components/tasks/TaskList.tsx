import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { useTaskStore } from '@/lib/store';
import { tasksAPI } from '@/lib/api';
import { toast } from 'sonner';

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

export function TaskList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { tasks, filters, setTasks, addTask, updateTask, deleteTask, reorderTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks({
        ...filters,
        status: filters.status === 'all' ? undefined : filters.status,
        priority: filters.priority === 'all' ? undefined : filters.priority,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      setSubmitting(true);
      const response = await tasksAPI.createTask(taskData);
      addTask(response.data.task);
      toast.success('Task created successfully');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (taskData: any) => {
    if (!selectedTask) return;

    try {
      setSubmitting(true);
      const response = await tasksAPI.updateTask(selectedTask._id, taskData);
      updateTask(selectedTask._id, response.data.task);
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId);
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const response = await tasksAPI.updateTask(taskId, { status: newStatus });
      updateTask(taskId, response.data.task);
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'updated'}`);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskIndex: number, completed: boolean) => {
    try {
      // Find the current task
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      // Create a copy of the subtasks array
      const updatedSubtasks = [...task.subtasks];
      
      // Update the specific subtask
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        completed
      };

      // Calculate new completion percentage
      const completedSubtasks = updatedSubtasks.filter(s => s.completed).length;

      // If all subtasks are completed, mark the task as completed as well
      let updatedStatus = task.status;
      if (completedSubtasks === updatedSubtasks.length && completedSubtasks > 0) {
        updatedStatus = 'completed';
      } else if (task.status === 'completed' && completedSubtasks < updatedSubtasks.length) {
        updatedStatus = 'in-progress';
      }

      // Make API call to update the task
      const response = await tasksAPI.updateTask(taskId, {
        subtasks: updatedSubtasks,
        status: updatedStatus
      });

      // Update the task in local state
      updateTask(taskId, response.data.task);
      
      // Show appropriate toast message
      if (completed) {
        toast.success('Subtask completed!', { duration: 1500 });
      }
      
      // If all subtasks are completed and task status changed to completed
      if (updatedStatus === 'completed' && task.status !== 'completed') {
        toast.success('All subtasks completed! Task marked as complete.', { 
          duration: 3000,
          icon: '🎉'
        });
      }
    } catch (error) {
      console.error('Failed to update subtask:', error);
      toast.error('Failed to update subtask');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    reorderTasks(items);

    try {
      // Send reorder request to backend
      const taskOrders = items.map((task, index) => ({
        id: task._id,
        order: index
      }));
      await tasksAPI.bulkReorderTasks(taskOrders);
    } catch (error) {
      // Revert on error
      reorderTasks(tasks);
      toast.error('Failed to reorder tasks');
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-700 dark:text-neutral-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border/50 panel-transition-in">
        <h2 className="text-3xl font-serif tracking-tight text-foreground font-medium">
          Tasks
        </h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-background hover:bg-muted/60 text-foreground border border-border/70 rounded-sm h-10 px-4 font-serif transition-colors duration-500"
        >
          <Plus className="mr-2 h-4.5 w-4.5" />
          Add Task
        </Button>
      </div>

      <TaskFilters />

      {tasks.length === 0 ? (
        <div className="text-center py-16 border border-border/50 rounded-sm p-10 bg-background">
          <div className="text-muted-foreground mb-8 text-lg font-serif">
            No tasks found. Create your first task to get started!
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-background hover:bg-muted/60 text-foreground border border-border/70 rounded-sm h-10 px-4 font-serif transition-colors duration-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transform transition-transform ${
                          snapshot.isDragging ? 'rotate-1 scale-102 shadow-lg' : ''
                        }`}
                      >
                        <TaskCard
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          onToggleStatus={handleToggleStatus}
                          onToggleSubtask={handleToggleSubtask}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <TaskForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTask}
        isLoading={submitting}
      />

      <TaskForm
        task={selectedTask || undefined}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditTask}
        isLoading={submitting}
      />
    </div>
  );
}