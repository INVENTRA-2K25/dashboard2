'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { NotificationManager } from '@/components/notification-manager';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function NotificationsPage() {
    const firestore = useFirestore();
    const notificationsQuery = useMemoFirebase(() => collection(firestore, 'notifications'), [firestore]);
    const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

    if (isLoading) {
        return (
          <DashboardLayout role="parent">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="parent"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Notifications</h1>
                <NotificationManager notifications={notifications || []} canCreate={false} />
            </div>
        </DashboardLayout>
    );
}
