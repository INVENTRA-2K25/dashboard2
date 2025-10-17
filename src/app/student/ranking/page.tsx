'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { RankingVault } from '@/components/student/ranking-vault';

export default function RankingPage() {
    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Leaderboard</h1>
                <RankingVault />
            </div>
        </DashboardLayout>
    );
}
