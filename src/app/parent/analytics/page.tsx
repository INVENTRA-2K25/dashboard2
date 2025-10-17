'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ChildAnalytics } from '@/components/parent/child-analytics';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Student, Parent } from '@/lib/types';
import { Loader2 } from 'lucide-react';


export default function AnalyticsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
    const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
    
    const childId = parentData?.childIds?.[0];
    const childDocRef = useMemoFirebase(() => childId ? doc(firestore, 'students', childId) : null, [childId, firestore]);
    const { data: child, isLoading: childLoading } = useDoc<Omit<Student, 'id'>>(childDocRef);

    if (parentLoading || childLoading || !child) {
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
                 <h1 className="text-3xl font-headline font-bold">Child Analytics</h1>
                <ChildAnalytics analytics={child.analytics} />
            </div>
        </DashboardLayout>
    );
}
