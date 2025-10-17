'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentRanking } from '@/components/teacher/student-ranking';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function RankingPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const studentsQuery = useMemoFirebase(
        () => (user ? collection(firestore, `teachers/${user.uid}/students`) : null),
        [user, firestore]
    );
    const { data: students, isLoading } = useCollection<Student>(studentsQuery);
    
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
                <h1 className="text-3xl font-headline font-bold">Student Ranking</h1>
                <StudentRanking students={students || []} />
            </div>
        </DashboardLayout>
    );
}
