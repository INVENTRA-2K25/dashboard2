'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentCalendar } from '@/components/student/student-calendar';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { CalendarEvent, Parent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
    const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
    
    const childId = parentData?.childIds?.[0];

    // Child's personal calendar events
    const childCalendarQuery = useMemoFirebase(() => childId ? collection(firestore, `students/${childId}/calendar`) : null, [childId, firestore]);
    const { data: childEvents, isLoading: childEventsLoading } = useCollection<CalendarEvent>(childCalendarQuery);
    
    // Global events for everyone or parents
    const globalCalendarQuery = useMemoFirebase(
        () => query(collection(firestore, 'calendar_events'), where('audience', 'in', ['everyone', 'parents'])),
        [firestore]
    );
    const { data: globalEvents, isLoading: globalLoading } = useCollection<CalendarEvent>(globalCalendarQuery);

    const isLoading = parentLoading || childEventsLoading || globalLoading;

    if (isLoading) {
        return (
            <DashboardLayout role="parent">
                <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    // Merge and deduplicate events
    const allEventsMap = new Map<string, CalendarEvent>();
    (childEvents || []).forEach(event => allEventsMap.set(event.id, event));
    (globalEvents || []).forEach(event => allEventsMap.set(event.id, event));
    const mergedEvents = Array.from(allEventsMap.values());

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Child's Calendar</h1>
                <StudentCalendar events={mergedEvents || []} />
            </div>
        </DashboardLayout>
    );
}