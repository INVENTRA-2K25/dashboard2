'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BehaviorInsights } from '@/components/parent/behavior-insights';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Student, Parent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function BehaviorInsightsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
    const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
    
    const childId = parentData?.childIds?.[0];
    const childDocRef = useMemoFirebase(() => childId ? doc(firestore, 'students', childId) : null, [childId, firestore]);
    const { data: child, isLoading: childLoading } = useDoc<Omit<Student, 'id'>>(childDocRef);

    const insightsCollectionRef = useMemoFirebase(() => childId ? collection(firestore, `students/${childId}/behaviorInsights`) : null, [childId, firestore]);
    const { data: behavioralInsights, isLoading: insightsLoading } = useCollection<{ insight: string; date: string }>(insightsCollectionRef);

    if (parentLoading || childLoading || insightsLoading) {
        return (
            <DashboardLayout role="parent">
                <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </DashboardLayout>
        );
    }
    
    if (!child) {
        return (
            <DashboardLayout role="parent">
                <div className="text-center">No child data found.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="parent"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Behavior Insights</h1>
                <BehaviorInsights
                    childName={child.name}
                    initialInsights={behavioralInsights?.map(i => i.insight) || []}
                />
            </div>
        </DashboardLayout>
    );
}
