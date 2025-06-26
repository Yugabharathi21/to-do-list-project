import { useState, useEffect } from 'react';
import { Plus, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { useNoteStore } from '@/lib/store';
import { notesAPI } from '@/lib/api';
import { toast } from 'sonner';

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

export function NotesList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { notes, noteFilters, setNotes, addNote, updateNote, deleteNote, setNoteFilters } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [noteFilters]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotes({
        ...noteFilters,
        color: noteFilters.color === 'all' ? undefined : noteFilters.color,
      });
      setNotes(response.data.notes);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData: any) => {
    try {
      setSubmitting(true);
      const response = await notesAPI.createNote(noteData);
      addNote(response.data.note);
      toast.success('Note created successfully');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = async (noteData: any) => {
    if (!selectedNote) return;

    try {
      setSubmitting(true);
      const response = await notesAPI.updateNote(selectedNote._id, noteData);
      updateNote(selectedNote._id, response.data.note);
      toast.success('Note updated successfully');
      setIsEditModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesAPI.deleteNote(noteId);
      deleteNote(noteId);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      const response = await notesAPI.togglePin(noteId);
      updateNote(noteId, response.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setNoteFilters({ [key]: value });
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notes
        </h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={noteFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={noteFilters.color}
              onValueChange={(value) => handleFilterChange('color', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={noteFilters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="date">Note Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No notes found. Create your first note to get started!
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pinned Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={openEditModal}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notes
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={openEditModal}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <NoteForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateNote}
        isLoading={submitting}
      />

      <NoteForm
        note={selectedNote || undefined}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditNote}
        isLoading={submitting}
      />
    </div>
  );
}