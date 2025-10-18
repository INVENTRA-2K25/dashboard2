'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';
import Webcam from 'react-webcam';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, Timer, XCircle } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { QuizGenerator } from './quiz-generator'; // We will use the existing quiz generator

// A simple in-memory chat history
const chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

export function FocusSession({ duration, onSessionEnd }: { duration: number; onSessionEnd: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const webcamRef = useRef<Webcam>(null);

  const [isFocused, setIsFocused] = useState(true); // Simplified focus state
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('Ask me anything about your topic!');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- Timer Setup ---
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration * 60);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => handleSessionEnd(),
  });

  const handleSessionEnd = async () => {
    try {
      if (user) {
        await addDocumentNonBlocking(collection(firestore, `students/${user.uid}/focus_sessions`), {
          startTime: expiryTimestamp.getTime() - duration * 60 * 1000,
          durationMinutes: duration,
          endTime: new Date().getTime(),
        });
        toast({ title: 'Focus Session Complete!', description: 'Your session has been logged.' });
      }
    } catch (error) {
      console.error("Error saving focus session:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your session.' });
    }
    onSessionEnd(); // Go back to the dashboard
  };

  // --- Chatbot Setup ---
  const handleSendMessage = async () => {
    if (!chatMessage) return;
    setIsChatLoading(true);
    setChatResponse('');

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(chatMessage);
    
    setChatResponse(result.response.text());
    chatHistory.push({ role: 'user', parts: [{ text: chatMessage }] });
    chatHistory.push({ role: 'model', parts: [{ text: result.response.text() }]});
    setChatMessage('');
    setIsChatLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-headline">Focus Mode</h1>
        <Button variant="ghost" size="icon" onClick={handleSessionEnd}>
          <XCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Timer and Camera */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Session Timer</CardTitle>
              <Timer className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold font-mono">
                <span>{String(hours).padStart(2, '0')}</span>:
                <span>{String(minutes).padStart(2, '0')}</span>:
                <span>{String(seconds).padStart(2, '0')}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="relative aspect-video overflow-hidden">
             <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${isFocused ? 'bg-green-500' : 'bg-red-500'}`}>
                {isFocused ? 'Focused' : 'Distracted'}
            </div>
          </Card>
        </div>

        {/* Right Panel: Chatbot and Quiz */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> AI Assistant</CardTitle>
                    <CardDescription>Ask questions about your study topic.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto bg-muted/50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{chatResponse}</p>
                </CardContent>
                <div className="p-4 flex items-center gap-2">
                    <Textarea placeholder="Ask a question..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} />
                    <Button onClick={handleSendMessage} disabled={isChatLoading}>
                        <Send />
                    </Button>
                </div>
            </Card>
            <div className="overflow-y-auto">
              <QuizGenerator />
            </div>
        </div>
      </div>
    </div>
  );
}