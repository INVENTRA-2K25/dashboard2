'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { JoinClass } from '@/components/join-class';

export default function JoinClassPage() {
    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Join Class</h1>
                <JoinClass role="student" />
            </div>
        </DashboardLayout>
    );
}