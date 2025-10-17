'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Complaint, Student } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFirestore, useUser, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ComplaintManagement({ complaints, students }: { complaints: Complaint[], students: Student[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();


  const getStatusVariant = (status: Complaint['status']) => {
    switch (status) {
      case 'resolved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'dismissed':
        return 'destructive';
    }
  };

  const handleStatusUpdate = async (complaintId: string, status: 'resolved' | 'dismissed') => {
    const complaintRef = doc(firestore, 'complaints', complaintId);
    await updateDocumentNonBlocking(complaintRef, { status });
    toast({ title: `Complaint marked as ${status}` });
  }

  const handleSubmit = async () => {
    if(!title || !description || !selectedStudent || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.'});
        return;
    }
    setIsSubmitting(true);
    const student = students?.find(s => s.id === selectedStudent);
    if (!student) return;

    // 1. Create the complaint
    const newComplaint = {
        title,
        description,
        studentId: selectedStudent,
        studentName: student.name,
        teacherId: user.uid,
        userId: user.uid, // The teacher is the user in this case
        date: new Date().toISOString(),
        status: 'pending'
    };
    await addDocumentNonBlocking(collection(firestore, 'complaints'), newComplaint);
    toast({ title: 'Complaint Submitted' });

    // 2. Send notification to the student
    const studentNotification = {
        title: `New Complaint Filed: ${title}`,
        description: `A new complaint has been filed by your teacher. Please check with your parents.`,
        date: new Date().toISOString(),
        read: false,
        userId: student.id,
    };
    await addDocumentNonBlocking(collection(firestore, `students/${student.id}/notifications`), studentNotification);
    
    // 3. Find the parent and send notification
    try {
        const parentsRef = collection(firestore, 'parents');
        const q = query(parentsRef, where('childIds', 'array-contains', student.id));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (parentDoc) => {
            const parentId = parentDoc.id;
            const parentNotification = {
                title: `New Complaint Regarding ${student.name}`,
                description: `A new complaint has been filed by your child's teacher: "${title}"`,
                date: new Date().toISOString(),
                read: false,
                userId: parentId,
            };
            await addDocumentNonBlocking(collection(firestore, `parents/${parentId}/notifications`), parentNotification);
        });
        toast({ title: 'Notifications Sent', description: "The student and parent have been notified."});

    } catch (error) {
        console.error("Error finding or notifying parent:", error);
        toast({ variant: 'destructive', title: 'Parent Notification Failed', description: 'Could not find or notify the parent.'});
    }


    setTitle('');
    setDescription('');
    setSelectedStudent('');
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Submit a New Complaint</CardTitle>
          <CardDescription>
            Log a new complaint regarding a student. This will also notify the parent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
             <Select onValueChange={setSelectedStudent} value={selectedStudent}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                    {students?.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input placeholder="Complaint Title" value={title} onChange={e => setTitle(e.target.value)}/>
            <Textarea placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} />
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className='animate-spin mr-2' />}
                Submit Complaint & Notify
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Complaint Management</CardTitle>
          <CardDescription>Review and address parent complaints.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {complaints.map((complaint) => (
              <AccordionItem key={complaint.id} value={complaint.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4 text-left">
                    <div>
                      <div className="font-medium">{complaint.title}</div>
                      <div className="text-sm text-muted-foreground">For: {complaint.studentName}</div>
                    </div>
                    <Badge variant={getStatusVariant(complaint.status)} className="capitalize">{complaint.status}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{complaint.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Submitted on: {new Date(complaint.date).toLocaleDateString()}</p>
                  {complaint.status === 'pending' && (
                      <div className='mt-4 flex gap-2'>
                          <Button size="sm" onClick={() => handleStatusUpdate(complaint.id, 'resolved')}>Mark as Resolved</Button>
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(complaint.id, 'dismissed')}>Dismiss</Button>
                      </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}