'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { HomeworkTracker } from '@/components/parent/homework-tracker';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Homework, Student, Parent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function HomeworkPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
    const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
    
    const childId = parentData?.childIds?.[0];
    const homeworkQuery = useMemoFirebase(() => childId ? collection(firestore, `students/${childId}/homework`) : null, [childId, firestore]);
    const { data: homeworks, isLoading: homeworkLoading } = useCollection<Homework>(homeworkQuery);


    if (parentLoading || homeworkLoading) {
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
                <h1 className="text-3xl font-headline font-bold">Homework Tracker</h1>
                <HomeworkTracker homeworks={homeworks || []} />
            </div>
        </DashboardLayout>
    );
}
