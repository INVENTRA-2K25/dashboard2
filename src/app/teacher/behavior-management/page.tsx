'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BehaviorManagement } from '@/components/teacher/behavior-management';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function BehaviorManagementPage() {
    const firestore = useFirestore();

    // Correctly fetch all documents from the 'users' collection where the role is 'student'
    const studentsQuery = useMemoFirebase(
        () => query(collection(firestore, 'users'), where('role', '==', 'student')),
        [firestore]
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
        <DashboardLayout role="teacher">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Behavior Management</h1>
                <BehaviorManagement students={students || []} />
            </div>
        </DashboardLayout>
    );
}