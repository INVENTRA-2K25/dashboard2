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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Complaint } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


export function ComplaintPortal({ complaints: initialComplaints }: { complaints: Complaint[] }) {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSubmit = async () => {
    if (!title || !description || !user) {
        toast({variant: 'destructive', title: 'Error', description: 'Please fill all fields'});
        return;
    }
    setIsLoading(true);

    const newComplaint = {
        title,
        description,
        userId: user.uid,
        studentName: 'Alex Johnson', // This should be dynamic
        studentId: 'student1', // This should be dynamic
        status: 'pending',
        date: new Date().toISOString()
    };

    await addDocumentNonBlocking(collection(firestore, 'complaints'), newComplaint);
    
    // Optimistically update UI
    setComplaints(prev => [{...newComplaint, id: 'temp-id'}, ...prev]);

    setTitle('');
    setDescription('');
    setIsLoading(false);
    toast({title: 'Success', description: 'Your complaint has been submitted.'})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Portal</CardTitle>
        <CardDescription>
          Submit a new complaint or view the status of existing ones.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Submit a New Complaint</h3>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <Input placeholder="Complaint Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} />
            <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className='animate-spin mr-2' />}
                Submit Complaint
            </Button>
          </form>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-4">Previous Complaints</h3>
            <Accordion type="single" collapsible className="w-full">
            {complaints.map((complaint) => (
                <AccordionItem key={complaint.id} value={complaint.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between items-center w-full pr-4">
                            <span className="font-medium">{complaint.title}</span>
                            <Badge variant={getStatusVariant(complaint.status)} className="capitalize">{complaint.status}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-muted-foreground">{complaint.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Submitted on: {new Date(complaint.date).toLocaleDateString()}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
