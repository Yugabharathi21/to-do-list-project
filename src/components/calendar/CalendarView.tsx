import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUIStore } from '@/lib/store';
import { notesAPI, tasksAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState<any[]>([]);
  const [monthNotes, setMonthNotes] = useState<any[]>([]);
  const [dayDetails, setDayDetails] = useState<{ tasks: any[], notes: any[] }>({ tasks: [], notes: [] });
  const [loading, setLoading] = useState(false);

  const { setSelectedDate: setGlobalSelectedDate } = useUIStore();

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  useEffect(() => {
    fetchDayDetails();
  }, [selectedDate]);

  const fetchMonthData = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);

      const [tasksResponse, notesResponse] = await Promise.all([
        tasksAPI.getTasks({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        notesAPI.getNotes({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      ]);

      setMonthTasks(tasksResponse.data.tasks || []);
      setMonthNotes(notesResponse.data.notes || []);
    } catch (error) {
      toast.error('Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDayDetails = async () => {
    try {
      const [tasksResponse, notesResponse] = await Promise.all([
        tasksAPI.getTasks({
          date: selectedDate.toISOString(),
        }),
        notesAPI.getNotes({
          date: selectedDate.toISOString(),
        }),
      ]);

      setDayDetails({
        tasks: tasksResponse.data.tasks || [],
        notes: notesResponse.data.notes || [],
      });
    } catch (error) {
      toast.error('Failed to fetch day details');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDayTasks = (date: Date) => {
    return monthTasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getDayNotes = (date: Date) => {
    return monthNotes.filter(note => 
      isSameDay(new Date(note.date), date)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setGlobalSelectedDate(date);
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Pad with previous/next month days to fill the calendar grid
  const firstDayOfWeek = startOfMonth(currentDate).getDay();
  const calendarDays: Date[] = [];
  
  // Add previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(startOfMonth(currentDate));
    day.setDate(day.getDate() - i - 1);
    calendarDays.push(day);
  }
  
  // Add current month days
  calendarDays.push(...monthDays);
  
  // Add next month days to complete the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(endOfMonth(currentDate));
    day.setDate(day.getDate() + i);
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const dayTasks = getDayTasks(date);
                  const dayNotes = getDayNotes(date);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isSelected = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={cn(
                        "p-2 min-h-[80px] text-left border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                        isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600",
                        isSelected && "bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700",
                        isTodayDate && "bg-blue-100 border-blue-300 dark:bg-blue-800 dark:border-blue-600"
                      )}
                    >
                      <div className="font-medium text-sm mb-1">
                        {format(date, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task._id}
                            className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate dark:bg-blue-900 dark:text-blue-300"
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayNotes.slice(0, 1).map((note) => (
                          <div
                            key={note._id}
                            className="text-xs p-1 bg-green-100 text-green-800 rounded truncate dark:bg-green-900 dark:text-green-300"
                          >
                            {note.title}
                          </div>
                        ))}
                        {(dayTasks.length > 2 || dayNotes.length > 1) && (
                          <div className="text-xs text-gray-500">
                            +{Math.max(0, dayTasks.length - 2) + Math.max(0, dayNotes.length - 1)} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Details Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h4>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-4">
                {/* Tasks for selected day */}
                {dayDetails.tasks.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasks ({dayDetails.tasks.length})
                    </h5>
                    <div className="space-y-2">
                      {dayDetails.tasks.map((task) => (
                        <div
                          key={task._id}
                          className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{task.title}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                task.priority === 'urgent' && "border-red-500 text-red-700",
                                task.priority === 'high' && "border-orange-500 text-orange-700",
                                task.priority === 'medium' && "border-yellow-500 text-yellow-700",
                                task.priority === 'low' && "border-green-500 text-green-700"
                              )}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes for selected day */}
                {dayDetails.notes.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes ({dayDetails.notes.length})
                    </h5>
                    <div className="space-y-2">
                      {dayDetails.notes.map((note) => (
                        <div
                          key={note._id}
                          className="p-2 bg-green-50 dark:bg-green-900 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{note.title}</span>
                            {note.isPinned && (
                              <Badge variant="outline">Pinned</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dayDetails.tasks.length === 0 && dayDetails.notes.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No tasks or notes for this day</p>
                    <Button size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add something
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}