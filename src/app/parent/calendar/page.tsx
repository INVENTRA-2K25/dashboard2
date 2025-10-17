'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentCalendar } from '@/components/student/student-calendar';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { CalendarEvent, Student, Parent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
    const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
    
    const childId = parentData?.childIds?.[0];
    const calendarQuery = useMemoFirebase(() => childId ? collection(firestore, `students/${childId}/calendar`) : null, [childId, firestore]);
    const { data: events, isLoading: eventsLoading } = useCollection<CalendarEvent>(calendarQuery);

    if (parentLoading || eventsLoading) {
        return (
            <DashboardLayout role="parent">
                <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Child's Calendar</h1>
                <StudentCalendar events={events || []} />
            </div>
        </DashboardLayout>
    );
}
