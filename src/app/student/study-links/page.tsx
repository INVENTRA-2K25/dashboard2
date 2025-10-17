'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudyLinks } from '@/components/student/study-links';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { StudyLink } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function StudyLinksPage() {
    const firestore = useFirestore();
    
    // Assuming study links are global for now
    const linksQuery = useMemoFirebase(
        () => collection(firestore, `study_links`),
        [firestore]
    );
    const { data: links, isLoading } = useCollection<StudyLink>(linksQuery);
    
    if (isLoading) {
        return (
          <DashboardLayout role="student">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="student"
        >
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">Study Links</h1>
                <StudyLinks links={links || []} />
            </div>
        </DashboardLayout>
    );
}
