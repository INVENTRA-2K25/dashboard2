'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { UserManagement } from '@/components/admin/user-management';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';


export default function UserManagementPage() {
    const firestore = useFirestore();
    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: allUsers, isLoading } = useCollection<User>(usersQuery);

    if (isLoading) {
        return (
          <DashboardLayout role="admin">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }
    
    return (
        <DashboardLayout
            role="admin"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">User Management</h1>
                <UserManagement users={allUsers || []} />
            </div>
        </DashboardLayout>
    );
}
