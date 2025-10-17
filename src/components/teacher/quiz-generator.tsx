'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { generateQuizForTopic } from '@/ai/flows/generate-quiz-for-topic';
import type { GenerateQuizForTopicOutput } from '@/ai/flows/generate-quiz-for-topic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function QuizGenerator({ classes }: { classes: { id: string, name: string }[] }) {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [quiz, setQuiz] = useState<GenerateQuizForTopicOutput['quiz'] | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!topic) return;
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuizForTopic({ topic, questionCount: 5 });
      setQuiz(result.quiz);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    }
    setIsLoading(false);
  };

  const handleAssignQuiz = async () => {
    if (!quiz || !selectedClass || !dueDate) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a class, due date, and generate a quiz first.' });
      return;
    }
    setIsAssigning(true);

    try {
      const examRef = doc(collection(firestore, 'exams'));
      const examData = {
        topic,
        classId: selectedClass,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        questions: quiz,
      };
      await addDocumentNonBlocking(examRef, examData);

      const studentsSnapshot = await getDocs(collection(firestore, `classes/${selectedClass}/students`));
      if (studentsSnapshot.empty) {
        toast({ variant: 'destructive', title: 'No students in class', description: 'Cannot assign quiz.' });
        setIsAssigning(false);
        return;
      }
      
      const batch = writeBatch(firestore);
      studentsSnapshot.forEach(studentDoc => {
        const studentExamRef = doc(collection(firestore, `students/${studentDoc.id}/exams`));
        batch.set(studentExamRef, {
            id: examRef.id,
            subject: topic,
            date: new Date().toISOString().split('T')[0],
            dueDate: format(dueDate, 'yyyy-MM-dd'),
            total: quiz.length,
            status: 'upcoming'
        });
      });

      await batch.commit();
      
      toast({ title: 'Quiz Assigned!', description: `The quiz on "${topic}" has been assigned to the class.` });
    } catch (error) {
      console.error("Failed to assign quiz:", error);
      toast({ variant: 'destructive', title: 'Assignment Failed', description: 'Could not assign the quiz.' });
    }
    setIsAssigning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Quiz Generator</CardTitle>
        <CardDescription>
          Enter a topic to generate a quiz, then assign it to a class as an exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input placeholder="e.g., The Solar System" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <Button onClick={handleGenerateQuiz} disabled={isLoading || !topic}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Quiz
          </Button>
        </div>

        {quiz && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Generated Quiz on: {topic}</h3>
            <div className="flex w-full max-w-md items-center space-x-2">
              <Select onValueChange={setSelectedClass} value={selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class to assign" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Button onClick={handleAssignQuiz} disabled={isAssigning || !selectedClass || !dueDate}>
                <Send className="mr-2 h-4 w-4" />
                Assign
              </Button>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {quiz.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{`Question ${index + 1}: ${item.question}`}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {item.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={`p-2 rounded-md ${option === item.answer ? 'bg-green-100 dark:bg-green-900' : 'bg-muted/50'}`}>
                          {option} {option === item.answer && <span className="font-bold text-green-600 dark:text-green-400 ml-2">(Correct)</span>}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}