'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, getDocs, query, where, doc, writeBatch, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type HomeworkData = {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    submissions: number;
    totalStudents: number;
}

export function HomeworkAssignment({ homeworks }: { homeworks: HomeworkData[] }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firestore = useFirestore();
  const { toast } = useToast();
  
  const handleAssign = async () => {
    if (!title || !subject || !dueDate || !instructions) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.' });
        return;
    }
    setIsLoading(true);

    try {
        // 1. Get all users with the role 'student'
        const studentsQuery = query(collection(firestore, 'users'), where('role', '==', 'student'));
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentIds = studentsSnapshot.docs.map(doc => doc.id);

        if (studentIds.length === 0) {
            toast({ variant: 'destructive', title: 'No Students', description: 'There are no students in the system to assign homework to.'});
            setIsLoading(false);
            return;
        }

        // 2. Create a single homework definition document
        const newHomeworkRef = await addDoc(collection(firestore, 'homework_definitions'), {
            title,
            subject,
            dueDate,
            instructions,
            submissions: 0,
            totalStudents: studentIds.length,
        });

        // 3. Create a batch write to add the homework to each student's personal collection
        const batch = writeBatch(firestore);
        studentIds.forEach(studentId => {
            const studentHomeworkRef = doc(collection(firestore, `students/${studentId}/homework`));
            batch.set(studentHomeworkRef, {
                id: newHomeworkRef.id, // Link back to the main homework document
                title,
                subject,
                dueDate,
                status: 'pending'
            });
        });

        // 4. Commit the batch
        await batch.commit();

        setTitle('');
        setSubject('');
        setDueDate('');
        setInstructions('');
        toast({ title: 'Success', description: `Homework assigned to all ${studentIds.length} student(s).` });
    } catch (error) {
        console.error("Error assigning homework: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not assign homework.'});
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homework Management</CardTitle>
        <CardDescription>Assign new homework to all students and track submissions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <Input placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <Input type="date" placeholder="Due Date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <Textarea placeholder="Instructions and details..." value={instructions} onChange={e => setInstructions(e.target.value)} />
            <Button onClick={handleAssign} disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Assign to All Students
            </Button>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Assignments</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworks.map((hw) => (
                <TableRow key={hw.id}>
                  <TableCell>
                    <div className="font-medium">{hw.title}</div>
                    <div className="text-sm text-muted-foreground">Due: {hw.dueDate}</div>
                  </TableCell>
                  <TableCell>
                    <Progress value={(hw.submissions / hw.totalStudents) * 100} className="w-full mb-1" />
                    <span className="text-sm text-muted-foreground">{hw.submissions}/{hw.totalStudents} submitted</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}