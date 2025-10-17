'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Loader2 } from 'lucide-react';
import type { Student, Exam } from '@/lib/types';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type StudentWithScore = {
  name: string;
  avatar: string;
  score: number;
};

export function RankingVault() {
  const [leaderboard, setLeaderboard] = useState<StudentWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();
  
  const studentsQuery = useMemoFirebase(() => collection(firestore, 'users'), []);
  const { data: allUsers, isLoading: usersLoading } = useCollection<Student>(studentsQuery);


  useEffect(() => {
    const calculateScores = async () => {
      if (!allUsers) return;

      const students = allUsers.filter(u => u.role === 'student');
      const studentScores: StudentWithScore[] = [];

      for (const student of students) {
        const examsSnapshot = await getDocs(collection(firestore, `students/${student.id}/exams`));
        const completedExams = examsSnapshot.docs
          .map(doc => doc.data() as Exam)
          .filter(exam => exam.status === 'completed' && exam.score !== undefined);

        if (completedExams.length > 0) {
          const totalScore = completedExams.reduce((acc, exam) => acc + (exam.score! / exam.total) * 100, 0);
          const averageScore = totalScore / completedExams.length;
          studentScores.push({
            name: student.name,
            avatar: student.avatar,
            score: parseFloat(averageScore.toFixed(1)),
          });
        }
      }

      setLeaderboard(studentScores.sort((a, b) => b.score - a.score));
      setIsLoading(false);
    };

    if (!usersLoading) {
      calculateScores();
    }
  }, [allUsers, usersLoading, firestore]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Leaderboard</CardTitle>
        <CardDescription>See how you stack up against your peers based on average exam scores.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className='flex justify-center items-center h-40'>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <ul className="space-y-4">
            {leaderboard.slice(0, 10).map((student, index) => (
                <li key={student.name} className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-muted/50">
                <span className="font-bold text-lg text-muted-foreground w-6">{index + 1}</span>
                <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 font-medium">{student.name}</span>
                <div className="flex items-center gap-1 text-amber-500">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold">{student.score}%</span>
                </div>
                </li>
            ))}
            </ul>
        )}
      </CardContent>
    </Card>
  );
}