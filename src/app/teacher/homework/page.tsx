'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { HomeworkAssignment } from '@/components/teacher/homework-assignment';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type HomeworkData = {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    submissions: number;
    totalStudents: number;
}

export default function HomeworkPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const homeworkQuery = useMemoFirebase(
        () => (user ? collection(firestore, `teachers/${user.uid}/homework`) : null),
        [user, firestore]
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
