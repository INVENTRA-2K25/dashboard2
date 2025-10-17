'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentCalendar } from '@/components/student/student-calendar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { CalendarEvent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    // Personal calendar events
    const personalCalendarQuery = useMemoFirebase(
        () => (user ? collection(firestore, `students/${user.uid}/calendar`) : null),
        [user, firestore]
    );
    const { data: personalEvents, isLoading: personalLoading } = useCollection<CalendarEvent>(personalCalendarQuery);

    // Global calendar events for everyone or students
    const globalCalendarQuery = useMemoFirebase(
        () => query(collection(firestore, 'calendar_events'), where('audience', 'in', ['everyone', 'students'])),
        [firestore]
    );
    const { data: globalEvents, isLoading: globalLoading } = useCollection<CalendarEvent>(globalCalendarQuery);
    
    const isLoading = personalLoading || globalLoading;

    if (isLoading) {
        return (
          <DashboardLayout role="student">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }
    
    // Merge and deduplicate events
    const allEventsMap = new Map<string, CalendarEvent>();
    (personalEvents || []).forEach(event => allEventsMap.set(event.id, event));
    (globalEvents || []).forEach(event => allEventsMap.set(event.id, event));
    const mergedEvents = Array.from(allEventsMap.values());

    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">My Calendar</h1>
                <StudentCalendar events={mergedEvents || []} />
            </div>
        </DashboardLayout>
    );
}