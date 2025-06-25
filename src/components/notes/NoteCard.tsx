import { useState } from 'react';
import { format } from 'date-fns';
import { 
  MoreVertical, 
  Trash2, 
  Edit, 
  Pin,
  PinOff,
  Tag
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

interface Note {
  _id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  color: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  isPinned: boolean;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColorClasses = (color: Note['color']) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'green': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'red': return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      case 'purple': return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
      case 'pink': return 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800';
      default: return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md relative",
      getColorClasses(note.color),
      note.isPinned && "ring-2 ring-blue-500 ring-opacity-50"
    )}>
      {note.isPinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-blue-500" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {note.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(note.date), 'MMM d, yyyy')}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePin(note._id)}>
                {note.isPinned ? (
                  <>
                    <PinOff className="mr-2 h-4 w-4" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-4 w-4" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(note._id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {isExpanded ? note.content : truncateContent(note.content)}
          </p>
          {note.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}