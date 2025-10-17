'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { UserManagement } from '@/components/admin/user-management';
import { StatsCard } from '@/components/stats-card';
import { Users, UserCheck, Shield, GraduationCap, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';

export default function AdminPage() {
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

  const userCounts = allUsers?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <DashboardLayout
      role="admin"
    >
      <div className="space-y-8 fade-in">
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={allUsers?.length || 0}
            description="Across all roles"
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Students"
            value={userCounts.student || 0}
            description="Enrolled in the system"
            icon={<GraduationCap className="h-5 w-5" />}
          />
          <StatsCard
            title="Teachers"
            value={userCounts.teacher || 0}
            description="Active educators"
            icon={<UserCheck className="h-5 w-5" />}
          />
          <StatsCard
            title="Parents"
            value={userCounts.parent || 0}
            description="Registered guardians"
            icon={<Shield className="h-5 w-5" />}
          />
        </div>

        <div className="fade-in-delay">
            {allUsers && <UserManagement users={allUsers} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
