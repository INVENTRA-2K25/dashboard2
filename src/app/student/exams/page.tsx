'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Exams } from '@/components/student/exams';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Exam } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ExamsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const examsQuery = useMemoFirebase(
        () => (user ? collection(firestore, `students/${user.uid}/exams`) : null),
        [user, firestore]
    );
    const { data: exams, isLoading } = useCollection<Exam>(examsQuery);
    
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
                <h1 className="text-3xl font-headline font-bold">My Exams</h1>
                <Exams exams={exams || []} />
            </div>
        </DashboardLayout>
    );
}
