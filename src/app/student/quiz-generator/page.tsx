'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { QuizGenerator } from '@/components/student/quiz-generator';

export default function QuizGeneratorPage() {
    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">AI Quiz Generator</h1>
                <p className="text-muted-foreground">Practice any topic by generating a quick quiz.</p>
                <QuizGenerator />
            </div>
        </DashboardLayout>
    );
}