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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { generateAiBehaviorNotesForTeacher } from '@/ai/flows/generate-ai-behavior-notes-for-teacher';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';

export function BehaviorManagement({ students }: { students: Student[] }) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleGenerateNotes = async () => {
    if (!selectedStudent || !observations || !user) return;
    setIsLoading(true);
    setAiNotes('');
    try {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        const result = await generateAiBehaviorNotesForTeacher({
          studentName: student.name,
          classDetails: 'Grade 10 Literature', // This should be dynamic
          behavioralObservations: observations
        });
        setAiNotes(result.behaviorNotes);

        // Save to firestore
        const behaviorLog = {
            teacherId: user.uid,
            studentId: student.id,
            studentName: student.name,
            observations,
            aiNotes: result.behaviorNotes,
            timestamp: serverTimestamp()
        };
        await addDocumentNonBlocking(collection(firestore, 'behaviorLogs'), behaviorLog);
        toast({ title: "Behavior logged successfully."});
        setObservations('');

      }
    } catch (error) {
      console.error("Failed to generate notes:", error);
      setAiNotes("Could not generate AI notes at this moment. Please try again.");
       toast({ variant: "destructive", title: "Error", description: "Failed to generate or log notes."});
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavior Management</CardTitle>
        <CardDescription>Log observations and get AI-powered notes for student behavior.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h3 className="text-lg font-semibold mb-4">Log New Behavior</h3>
            <div className="space-y-4">
                <Select onValueChange={setSelectedStudent}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                    {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Textarea 
                    placeholder="Enter behavioral observations..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                />
                <Button onClick={handleGenerateNotes} disabled={isLoading || !selectedStudent || !observations}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate AI Notes & Log Behavior
                </Button>
            </div>
        </div>
        {aiNotes && (
          <div className="border p-4 rounded-md bg-muted/50">
            <h4 className="font-semibold mb-2">AI Generated Insights</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
