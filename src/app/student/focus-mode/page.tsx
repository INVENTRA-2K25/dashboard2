'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AIFocusMode } from '@/components/student/ai-focus-mode';

export default function FocusModePage() {
    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">AI Focus Mode</h1>
                <AIFocusMode />
            </div>
        </DashboardLayout>
    );
}
