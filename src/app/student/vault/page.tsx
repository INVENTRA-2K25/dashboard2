'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentVault } from '@/components/student/student-vault';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { VaultFile } from '@/lib/types';
import { Loader2 } from 'lucide-react';


export default function VaultPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const vaultQuery = useMemoFirebase(
        () => (user ? collection(firestore, `students/${user.uid}/vault`) : null),
        [user, firestore]
    );
    const { data: files, isLoading } = useCollection<VaultFile>(vaultQuery);
    
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
                <h1 className="text-3xl font-headline font-bold">My Vault</h1>
                <StudentVault files={files || []} />
            </div>
        </DashboardLayout>
    );
}
