'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { QuizGenerator } from '@/components/teacher/quiz-generator';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function QuizGeneratorPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [classes, setClasses] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchTeacherClasses = async () => {
            try {
                const classesRef = collection(firestore, 'classes');
                const q = query(classesRef, where('teacherIds', 'array-contains', user.uid));
                const querySnapshot = await getDocs(q);
                const fetchedClasses = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: `Class ${doc.data().className} - ${doc.data().division}`
                }));
                setClasses(fetchedClasses);
            } catch (error) {
                console.error("Error fetching classes: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeacherClasses();
    }, [user, firestore]);


    if (isLoading) {
        return (
          <DashboardLayout role="teacher">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">AI Quiz Generator</h1>
                <QuizGenerator classes={classes} />
            </div>
        </DashboardLayout>
    );
}