'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ComplaintPortal } from '@/components/parent/complaint-portal';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Complaint } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ComplaintsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const complaintsQuery = useMemoFirebase(() => user ? collection(firestore, 'complaints') : null, [user, firestore]);
    // This is not secure, but for now we filter on the client.
    const { data: allComplaints, isLoading } = useCollection<Complaint>(complaintsQuery);

    if (isLoading) {
        return (
            <DashboardLayout role="parent">
                <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }
    
    const userComplaints = allComplaints?.filter(c => c.userId === user?.uid) || [];

    return (
        <DashboardLayout
            role="parent"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Complaint Portal</h1>
                <ComplaintPortal complaints={userComplaints} />
            </div>
        </DashboardLayout>
    );
}
