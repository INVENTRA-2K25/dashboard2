'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { mockStudentData, mockUsers } from '@/lib/mock-data';
import { StudentAnalytics } from '@/components/student/student-analytics';

export default function AnalyticsPage() {
    const user = mockUsers['student@edhub.com'];
    return (
        <DashboardLayout
            role="student"
            user={{ name: user.name, email: user.email, avatar: user.avatar }}
        >
            <div className="space-y-8 fade-in">
                <StudentAnalytics analytics={mockStudentData.analytics} />
            </div>
        </DashboardLayout>
    );
}
