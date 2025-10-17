'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { HomeworkList } from '@/components/student/homework-list';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Homework } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function HomeworkPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const homeworkQuery = useMemoFirebase(
        () => (user ? collection(firestore, `students/${user.uid}/homework`) : null),
        [user, firestore]
    );
    const { data: homeworks, isLoading } = useCollection<Homework>(homeworkQuery);
    
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
                <h1 className="text-3xl font-headline font-bold">My Homework</h1>
                <HomeworkList homeworks={homeworks || []} />
            </div>
        </DashboardLayout>
    );
}