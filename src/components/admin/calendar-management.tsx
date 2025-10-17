'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CalendarEvent } from '@/lib/types';
import { PlusCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function CalendarManagement({ events }: { events: CalendarEvent[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState<{ title: string; type: CalendarEvent['type']; audience: CalendarEvent['audience']; date: Date | undefined }>({
    title: '',
    type: 'event',
    audience: 'everyone',
    date: new Date(),
  });

  const firestore = useFirestore();
  const { toast } = useToast();

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type || !newEvent.audience) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
      return;
    }
    setIsLoading(true);

    const eventToAdd = {
      title: newEvent.title,
      date: format(newEvent.date, 'yyyy-MM-dd'),
      type: newEvent.type,
      audience: newEvent.audience,
    };

    await addDocumentNonBlocking(collection(firestore, 'calendar_events'), eventToAdd);

    toast({ title: 'Success', description: 'The event has been added to the calendar.' });
    setIsLoading(false);
    setIsDialogOpen(false);
    setNewEvent({ title: '', type: 'event', audience: 'everyone', date: new Date() }); // Reset form
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Institution Calendar Management</CardTitle>
            <CardDescription>Manage system-wide events, holidays, and exams.</CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Event
              </span>
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div className='flex justify-center'>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <ul className="space-y-2">
              {events.map(event => (
                <li key={event.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <div>
                    <p className='font-medium'>{event.title}</p>
                    <p className='text-sm text-muted-foreground'>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <span className='text-xs capitalize font-semibold'>{event.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Calendar Event</DialogTitle>
          <DialogDescription>
            Create a new event that will be visible to the selected audience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <div className='flex justify-center'>
            <Calendar
              mode="single"
              selected={newEvent.date}
              onSelect={(d) => setNewEvent({ ...newEvent, date: d })}
              className="rounded-md border"
            />
          </div>
          <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as CalendarEvent['type'] })}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newEvent.audience} onValueChange={(value) => setNewEvent({ ...newEvent, audience: value as CalendarEvent['audience'] })}>
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="teachers">Teachers Only</SelectItem>
              <SelectItem value="students">Students Only</SelectItem>
              <SelectItem value="parents">Parents Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}