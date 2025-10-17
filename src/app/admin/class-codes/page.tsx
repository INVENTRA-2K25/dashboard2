'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ClassCodeGenerator } from '@/components/admin/class-code-generator';

export default function ClassCodesPage() {
    return (
        <DashboardLayout
            role="admin"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Class Code Management</h1>
                <ClassCodeGenerator />
            </div>
        </DashboardLayout>
    );
}
