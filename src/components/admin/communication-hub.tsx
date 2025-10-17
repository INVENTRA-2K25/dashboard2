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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CommunicationHub() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if(!recipient || !subject || !message) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
      return;
    }
    setIsLoading(true);

    const announcement = {
      title: subject,
      description: message,
      date: new Date().toISOString(),
      audience: recipient,
      read: false,
    };

    await addDocumentNonBlocking(collection(firestore, 'notifications'), announcement);

    toast({ title: 'Success', description: 'Your message has been sent.' });
    setSubject('');
    setMessage('');
    setRecipient('');
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Hub</CardTitle>
        <CardDescription>Send announcements and messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Select onValueChange={setRecipient} value={recipient}>
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="students">All Students</SelectItem>
              <SelectItem value="teachers">All Teachers</SelectItem>
              <SelectItem value="parents">All Parents</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <Textarea placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
