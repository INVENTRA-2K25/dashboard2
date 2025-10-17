'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { CalendarEvent } from '@/lib/types';

export function CalendarManagement({ events }: { events: CalendarEvent[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // This is a simplified version. A real implementation would mark event dates.
  const eventDates = events.map(e => new Date(e.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institution Calendar Management</CardTitle>
        <CardDescription>Manage system-wide events, holidays, and exams.</CardDescription>
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
  );
}
