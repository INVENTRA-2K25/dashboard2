'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CalendarManagement } from '@/components/admin/calendar-management';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CalendarEvent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CalendarManagementPage() {
    const firestore = useFirestore();
    const eventsQuery = useMemoFirebase(() => collection(firestore, 'calendar_events'), [firestore]);
    const { data: events, isLoading } = useCollection<CalendarEvent>(eventsQuery);

    if (isLoading) {
        return (
          <DashboardLayout role="admin">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Calendar Management</h1>
                 <CalendarManagement events={events || []} />
            </div>
        </DashboardLayout>
    );
}
