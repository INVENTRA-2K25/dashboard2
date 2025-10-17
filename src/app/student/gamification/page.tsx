'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { GamificationStats } from '@/components/student/gamification-stats';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function GamificationPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const studentDocRef = useMemoFirebase(
      () => (user ? doc(firestore, 'students', user.uid) : null),
      [user, firestore]
    );
    
    const { data: studentData, isLoading } = useDoc<Omit<Student, 'id'>>(studentDocRef);

    if (isLoading || !studentData) {
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
                <h1 className="text-3xl font-headline font-bold">My Achievements</h1>
                <GamificationStats gamification={studentData.gamification} />
            </div>
        </DashboardLayout>
    );
}
