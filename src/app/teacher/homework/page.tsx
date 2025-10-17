'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { HomeworkAssignment } from '@/components/teacher/homework-assignment';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { Homework } from '@/lib/types';

// Simplified type for this page's purpose
type HomeworkData = Omit<Homework, 'status' | 'submittedDate'> & {
    submissions: number;
    totalStudents: number;
};

export default function HomeworkPage() {
    const firestore = useFirestore();
    
    // Fetch from the new top-level 'homework_definitions' collection
    const homeworkQuery = useMemoFirebase(
        () => collection(firestore, `homework_definitions`),
        [firestore]
    );
    const { data: homeworks, isLoading } = useCollection<HomeworkData>(homeworkQuery);
    
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
                <h1 className="text-3xl font-headline font-bold">Homework Management</h1>
                <HomeworkAssignment homeworks={homeworks || []} />
            </div>
        </DashboardLayout>
    );
}