'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ComplaintManagement } from '@/components/teacher/complaint-management';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, where, documentId } from 'firebase/firestore';
import type { Complaint, Student, Teacher } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ComplaintsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const complaintsQuery = useMemoFirebase(
        () => (user ? query(collection(firestore, 'complaints'), where('teacherId', '==', user.uid)) : null),
        [user, firestore]
    );
    const { data: complaints, isLoading: complaintsLoading } = useCollection<Complaint>(complaintsQuery);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        };

        const fetchTeacherStudents = async () => {
            try {
                const teacherDocRef = doc(firestore, 'teachers', user.uid);
                const teacherDoc = await getDoc(teacherDocRef);

                if (!teacherDoc.exists()) {
                    setStudents([]);
                    return;
                }

                const teacherData = teacherDoc.data() as Teacher;
                const courseIds = teacherData.courseIds || [];

                if (courseIds.length === 0) {
                    setStudents([]);
                    return;
                }

                const studentIds = new Set<string>();
                for (const classId of courseIds) {
                    const studentsSnapshot = await getDocs(collection(firestore, `classes/${classId}/students`));
                    studentsSnapshot.forEach(doc => studentIds.add(doc.id));
                }

                if (studentIds.size > 0) {
                    const studentsRef = collection(firestore, 'students');
                    const studentQuery = query(studentsRef, where(documentId(), 'in', Array.from(studentIds)));
                    const studentDocs = await getDocs(studentQuery);
                    const studentData = studentDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
                    setStudents(studentData);
                }
            } catch (error) {
                console.error("Error fetching teacher's students:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeacherStudents();
    }, [user, firestore]);

    if (isLoading || complaintsLoading) {
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
                <h1 className="text-3xl font-headline font-bold">Complaint Management</h1>
                <ComplaintManagement complaints={complaints || []} students={students} />
            </div>
        </DashboardLayout>
    );
}