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
import type { Notification } from '@/lib/types';
import { Badge } from './ui/badge';
import { Bell, BellRing, Loader2 } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function NotificationManager({ notifications: initialNotifications, canCreate }: { notifications: Notification[], canCreate: boolean }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleCreateAnnouncement = async () => {
    if (!title || !description) {
        toast({ variant: 'destructive', title: 'Please fill all fields' });
        return;
    }
    setIsLoading(true);

    const newAnnouncement = {
        title,
        description,
        date: new Date().toISOString(),
        read: false,
    };
    await addDocumentNonBlocking(collection(firestore, 'notifications'), newAnnouncement);

    setTitle('');
    setDescription('');
    setIsLoading(false);
    toast({ title: 'Announcement sent!' });
  }

  return (
    <div className={`grid gap-8 ${canCreate ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
      {canCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
            <CardDescription>Send a new announcement to users.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Announcement Title" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Describe the announcement..." value={description} onChange={e => setDescription(e.target.value)} />
              <Button onClick={handleCreateAnnouncement} disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Send Announcement
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>View past and present notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                 {notification.read ? <Bell className="h-5 w-5 mt-1 text-muted-foreground" /> : <BellRing className="h-5 w-5 mt-1 text-primary" />}
                <div className='flex-1'>
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && <Badge>New</Badge>}
                    </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
