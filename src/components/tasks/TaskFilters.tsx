import { Search, SortAsc, SortDesc, FilterX } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function TaskFilters() {
  const { filters, setFilters } = useTaskStore();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const toggleSortOrder = () => {
    setFilters({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="bg-card/90 backdrop-blur-[2px] rounded-sm border border-border/70 p-5 mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-all duration-700">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-500" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={cn(
                "pl-10 h-10 text-sm pr-4 bg-background",
                "border-border/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/20",
                "font-[var(--font-body)] rounded-sm transition-all duration-500",
                "placeholder:text-muted-foreground/70"
              )}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className={cn(
              "w-36 h-10 bg-background border-border/60 rounded-sm",
              "font-[var(--font-body)] text-sm",
              "hover:bg-secondary/80 focus:ring-1 focus:ring-primary/20",
              "transition-all duration-500 shadow-sm"
            )}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/80 rounded-sm shadow-md">
              <SelectItem value="all" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">All Status</SelectItem>
              <SelectItem value="pending" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Pending</SelectItem>
              <SelectItem value="in-progress" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">In Progress</SelectItem>
              <SelectItem value="completed" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)]">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger className={cn(
              "w-36 h-10 bg-background border-border/60 rounded-sm",
              "font-[var(--font-body)] text-sm",
              "hover:bg-secondary/80 focus:ring-1 focus:ring-primary/20",
              "transition-all duration-500 shadow-sm"
            )}>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/80 rounded-sm shadow-md">
              <SelectItem value="all" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">All Priority</SelectItem>
              <SelectItem value="urgent" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Urgent</SelectItem>
              <SelectItem value="high" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">High</SelectItem>
              <SelectItem value="medium" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Medium</SelectItem>
              <SelectItem value="low" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)]">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className={cn(
              "w-42 h-10 bg-background border-border/60 rounded-sm",
              "font-[var(--font-body)] text-sm",
              "hover:bg-secondary/80 focus:ring-1 focus:ring-primary/20",
              "transition-all duration-500 shadow-sm"
            )}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/80 rounded-sm shadow-md">
              <SelectItem value="createdAt" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Created Date</SelectItem>
              <SelectItem value="dueDate" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Due Date</SelectItem>
              <SelectItem value="priority" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)] mb-1">Priority</SelectItem>
              <SelectItem value="title" className="py-1.5 px-2 hover:bg-secondary/70 focus:bg-secondary/70 rounded-sm text-sm font-[var(--font-body)]">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={toggleSortOrder}
            className={cn(
              "px-3 h-10 bg-background border-border/60 rounded-sm",
              "hover:bg-secondary/80 focus:ring-1 focus:ring-primary/20",
              "transition-all duration-500 text-primary shadow-sm"
            )}
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>

          {(filters.search !== '' || 
             filters.status !== 'all' || 
             filters.priority !== 'all' || 
             filters.sortBy !== 'createdAt' || 
             filters.sortOrder !== 'desc') && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className={cn(
                "px-3 h-10 rounded-sm",
                "hover:bg-secondary/80 text-muted-foreground hover:text-foreground",
                "transition-all duration-500 flex items-center gap-1 font-[var(--font-body)]"
              )}
            >
              <FilterX className="h-3.5 w-3.5" />
              <span className="text-xs">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}