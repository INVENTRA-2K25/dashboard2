'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { CalendarEvent } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isFuture, isPast, isToday } from 'date-fns';

export function StudentCalendar({ events }: { events: CalendarEvent[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const futureEvents = sortedEvents.filter(e => isFuture(new Date(e.date)) && !isToday(new Date(e.date)));
  const pastEvents = sortedEvents.filter(e => isPast(new Date(e.date)) && !isToday(new Date(e.date)));
  const presentEvents = sortedEvents.filter(e => isToday(new Date(e.date)));

  const EventList = ({ events }: { events: CalendarEvent[] }) => (
    <ul className="space-y-3">
        {events.length > 0 ? events.map(event => (
            <li key={event.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                    <p className='font-medium'>{event.title}</p>
                    <p className='text-sm text-muted-foreground'>{format(new Date(event.date), 'PPP')}</p>
                </div>
                <span className='text-xs capitalize font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary-foreground'>{event.type}</span>
            </li>
        )) : <p className="text-sm text-muted-foreground text-center py-4">No events in this category.</p>}
    </ul>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Calendar</CardTitle>
        <CardDescription>Upcoming deadlines and events.</CardDescription>
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
            <Tabs defaultValue="present" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="present">Present</TabsTrigger>
                    <TabsTrigger value="future">Future</TabsTrigger>
                </TabsList>
                <TabsContent value="past">
                    <EventList events={pastEvents} />
                </TabsContent>
                <TabsContent value="present">
                     <EventList events={presentEvents} />
                </TabsContent>
                <TabsContent value="future">
                    <EventList events={futureEvents} />
                </TabsContent>
            </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
