'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentCalendar } from '@/components/student/student-calendar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CalendarEvent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const calendarQuery = useMemoFirebase(
        () => (user ? collection(firestore, `students/${user.uid}/calendar`) : null),
        [user, firestore]
    );
    const { data: events, isLoading } = useCollection<CalendarEvent>(calendarQuery);
    
    if (isLoading) {
        return (
          <DashboardLayout role="student">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">My Calendar</h1>
                <StudentCalendar events={events || []} />
            </div>
        </DashboardLayout>
    );
}
