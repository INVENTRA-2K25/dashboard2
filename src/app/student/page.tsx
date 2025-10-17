'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { GamificationStats } from '@/components/student/gamification-stats';
import { AIFocusMode } from '@/components/student/ai-focus-mode';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function StudentPage() {
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
        <h1 className="text-3xl font-headline font-bold">Welcome, {user?.displayName || 'Student'}!</h1>

        <div className="fade-in-delay">
          <GamificationStats gamification={studentData.gamification} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 fade-in-delay">
          <div className="lg:col-span-5">
            <AIFocusMode />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
