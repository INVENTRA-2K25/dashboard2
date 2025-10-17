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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';


export function JoinClass() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleJoinClass = async () => {
    if (!code.trim() || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a class code.',
      });
      return;
    }
    setIsLoading(true);

    try {
        const codesRef = collection(firestore, 'classCodes');
        const q = query(codesRef, where("code", "==", code.trim().toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({
                variant: 'destructive',
                title: 'Invalid Code',
                description: 'The class code you entered is not valid. Please try again.',
              });
        } else {
            const classDoc = querySnapshot.docs[0];
            const studentRef = doc(firestore, 'students', user.uid);
            // This is a simplified example. In a real app, you might add the student to a subcollection on the class.
            await updateDoc(studentRef, {
                courseIds: arrayUnion(classDoc.id)
            })
            toast({
                title: 'Success!',
                description: `You've successfully joined Class ${classDoc.data().class}-${classDoc.data().division}.`,
              });
            setCode('');
        }

    } catch(e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not join class. Please try again later.',
          });
    }


    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Join a Class</CardTitle>
        <CardDescription>
          Enter the unique code provided by your administrator or teacher to get enrolled in a class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Enter class code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            className="uppercase"
          />
          <Button onClick={handleJoinClass} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
