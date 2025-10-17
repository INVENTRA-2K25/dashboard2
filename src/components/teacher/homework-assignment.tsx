'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
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

export function HomeworkAssignment({ homeworks }: { homeworks: HomeworkData[]}) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const handleAssign = async () => {
    if (!title || !subject || !dueDate || !instructions || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.' });
        return;
    }
    setIsLoading(true);

    const newHomework = {
        title,
        subject,
        dueDate,
        instructions,
        submissions: 0,
        totalStudents: 20, // This should be dynamic based on class size
    };

    await addDocumentNonBlocking(collection(firestore, `teachers/${user.uid}/homework`), newHomework);

    setTitle('');
    setSubject('');
    setDueDate('');
    setInstructions('');
    setIsLoading(false);
    toast({ title: 'Success', description: 'Homework assigned.' });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Homework Management</CardTitle>
        <CardDescription>Assign new homework and track submissions.</CardDescription>
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
                Assign Homework
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
