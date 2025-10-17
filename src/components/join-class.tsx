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
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, doc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import type { UserRole } from '@/lib/types';


export function JoinClass({ role }: { role: UserRole }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const isParent = role === 'parent';

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
            const classId = classDoc.id;
            const collectionName = role === 'student' ? 'students' : 'teachers';

            // Add user to the class's subcollection
            await setDoc(doc(firestore, `classes/${classId}/${collectionName}`, user.uid), {
              name: user.displayName,
              joinedAt: new Date().toISOString(),
            });
            
            // If teacher, add their ID to the class document for easy querying
            if (role === 'teacher') {
              await updateDoc(doc(firestore, 'classes', classId), {
                teacherIds: arrayUnion(user.uid)
              });
            }

            // Create or update the user's main profile document
            const userDocRef = doc(firestore, `${collectionName}`, user.uid);
            await setDoc(userDocRef, {
                courseIds: arrayUnion(classId)
            }, { merge: true });

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
          {isParent
            ? "Your child can join a class using a code from their dashboard. Parents view classes through their linked child's profile."
            : "Enter the unique code provided by your administrator to get enrolled in a class."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Enter class code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading || isParent}
            className="uppercase"
          />
          <Button onClick={handleJoinClass} disabled={isLoading || isParent}>
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