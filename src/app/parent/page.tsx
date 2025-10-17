'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StatsCard } from '@/components/stats-card';
import { BookOpen, Clock, Star, Loader2 } from 'lucide-react';
import { ChildAnalytics } from '@/components/parent/child-analytics';
import { BehaviorInsights } from '@/components/parent/behavior-insights';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Student, Parent } from '@/lib/types';

export default function ParentPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [user, firestore]);
  const { data: parentData, isLoading: parentLoading } = useDoc<Parent>(parentDocRef);
  
  const childId = parentData?.childIds?.[0];
  const childDocRef = useMemoFirebase(() => childId ? doc(firestore, 'students', childId) : null, [childId, firestore]);
  const { data: child, isLoading: childLoading } = useDoc<Omit<Student, 'id'>>(childDocRef);

  const insightsCollectionRef = useMemoFirebase(() => childId ? collection(firestore, `students/${childId}/behaviorInsights`) : null, [childId, firestore]);
  const { data: behavioralInsights, isLoading: insightsLoading } = useCollection<{ insight: string; date: string }>(insightsCollectionRef);

  if (parentLoading || childLoading || insightsLoading) {
    return (
      <DashboardLayout role="parent">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (!child) {
    return (
       <DashboardLayout role="parent">
        <div className="flex justify-center items-center h-full">
          <p>No child data found.</p>
        </div>
      </DashboardLayout>
    )
  }

  const averageScore =
    child.analytics.performance.reduce((acc, p) => acc + p.score, 0) /
    (child.analytics.performance.length || 1);
  
  const pendingHomework = child.homework.filter(
    (h) => h.status === 'pending'
  ).length;

  return (
    <DashboardLayout
      role="parent"
    >
      <div className="space-y-8 fade-in">
        <h1 className="text-3xl font-headline font-bold">
          {child.name}'s Dashboard
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Average Score"
            value={`${averageScore.toFixed(1)}%`}
            description="Across all subjects"
            icon={<Star className="h-5 w-5" />}
          />
          <StatsCard
            title="Pending Homework"
            value={pendingHomework}
            description="Assignments to be completed"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatsCard
            title="Total Study Time"
            value={`${child.analytics.timeSpent.reduce(
              (acc, s) => acc + s.hours,
              0
            )} hrs`}
            description="This month"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-5 fade-in-delay">
          <div className="lg:col-span-3 space-y-8">
            <ChildAnalytics analytics={child.analytics} />
          </div>
          <div className="lg:col-span-2">
            <BehaviorInsights
              childName={child.name}
              initialInsights={behavioralInsights?.map(i => i.insight) || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
