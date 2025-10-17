'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { provideAiFocusModeForStudents } from '@/ai/flows/provide-ai-focus-mode-for-students';
import { ScrollArea } from '../ui/scroll-area';

export function AIFocusMode() {
    const [isOpen, setIsOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const [focusLevel, setFocusLevel] = useState('Medium');
    const [isLoading, setIsLoading] = useState(false);
    const [studyGuide, setStudyGuide] = useState('');

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setStudyGuide('');
        try {
            const result = await provideAiFocusModeForStudents({ topic, focusLevel });
            setStudyGuide(result.studyGuide);
        } catch (error) {
            console.error("Failed to generate study guide:", error);
            setStudyGuide("Sorry, I couldn't generate a study guide at this moment. Please try again later.");
        }
        setIsLoading(false);
    };

    return (
        <>
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>AI Focus Mode</CardTitle>
                    <CardDescription>Enter a distraction-free learning zone powered by AI.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                    <Sparkles className="h-16 w-16 text-primary mb-4" />
                    <p className="text-muted-foreground">Click below to start a focused study session.</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setIsOpen(true)}>
                        Launch Focus Mode
                    </Button>
                </CardFooter>
            </Card>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>AI-Powered Focus Session</DialogTitle>
                    <DialogDescription>
                        Enter a topic and your desired focus level to get a tailored study guide.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4">
                    <Input 
                        placeholder="e.g., Photosynthesis"
                        className="col-span-2"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <Select value={focusLevel} onValueChange={setFocusLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Focus Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleGenerate} disabled={isLoading || !topic}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Study Guide
                </Button>
                <ScrollArea className="flex-grow border rounded-md p-4 mt-4">
                    {studyGuide ? (
                         <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: studyGuide.replace(/\n/g, '<br />') }}></div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            {isLoading ? 'Generating your personalized study guide...' : 'Your study guide will appear here.'}
                        </div>
                    )}
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
