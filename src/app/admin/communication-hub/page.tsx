'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CommunicationHub } from '@/components/admin/communication-hub';

export default function CommunicationHubPage() {
    return (
        <DashboardLayout
            role="admin"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Communication Hub</h1>
                <CommunicationHub />
            </div>
        </DashboardLayout>
    );
}
