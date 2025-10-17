'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ComplaintManagement } from '@/components/teacher/complaint-management';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Complaint } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ComplaintsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const complaintsQuery = useMemoFirebase(
        () => (user ? query(collection(firestore, 'complaints'), where('teacherId', '==', user.uid)) : null),
        [user, firestore]
    );
    const { data: complaints, isLoading } = useCollection<Complaint>(complaintsQuery);

    if (isLoading) {
        return (
          <DashboardLayout role="teacher">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }
    
    return (
        <DashboardLayout
            role="teacher"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Complaint Management</h1>
                <ComplaintManagement complaints={complaints || []} />
            </div>
        </DashboardLayout>
    );
}
