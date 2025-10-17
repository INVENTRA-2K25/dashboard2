'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ClassAnalytics } from '@/components/teacher/class-analytics';
import { StatsCard } from '@/components/stats-card';
import { Users, Book, Frown, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Complaint, Student } from '@/lib/types';

export default function TeacherPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const studentsQuery = useMemoFirebase(
    () => (user ? collection(firestore, `teachers/${user.uid}/students`) : null),
    [user, firestore]
  );
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);
  
  const complaintsQuery = useMemoFirebase(
    () => (user ? collection(firestore, `teachers/${user.uid}/complaints`) : null),
    [user, firestore]
  );
  const { data: complaints, isLoading: complaintsLoading } = useCollection<Complaint>(complaintsQuery);

  if (studentsLoading || complaintsLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }
  
  const classAverage = students && students.length > 0 ? (
    students.reduce((acc, s) => acc + (s.analytics?.performance.reduce((pAcc, p) => pAcc + p.score, 0) / (s.analytics?.performance.length || 1) || 0), 0) / students.length
  ).toFixed(1) : 0;


  return (
    <DashboardLayout role="teacher">
      <div className="space-y-8 fade-in">
        <h1 className="text-3xl font-headline font-bold">Teacher Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Students"
            value={students?.length || 0}
            description="In your classes"
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Class Average"
            value={`${classAverage}%`}
            description="Overall performance"
            icon={<Book className="h-5 w-5" />}
          />
          <StatsCard
            title="Open Complaints"
            value={complaints?.filter(c => c.status === 'pending').length || 0}
            description="Require your attention"
            icon={<Frown className="h-5 w-5" />}
          />
        </div>

        <div className="fade-in-delay">
          {students && <ClassAnalytics students={students} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
