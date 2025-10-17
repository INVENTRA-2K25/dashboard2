import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import type { Student } from '@/lib/types';


export function StudentRanking({ students }: { students: Student[] }) {

  const getOverallScore = (student: Student) => {
    if (!student.analytics?.performance || student.analytics.performance.length === 0) {
        return 0;
    }
    const total = student.analytics.performance.reduce((acc, p) => acc + p.score, 0);
    return total / student.analytics.performance.length;
  }

  const sortedStudents = [...students].sort((a, b) => getOverallScore(b) - getOverallScore(a));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Ranking based on overall scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedStudents.slice(0, 5).map((student, index) => (
            <li key={student.id} className="flex items-center gap-4">
              <span className="font-bold text-lg text-muted-foreground w-6">{index + 1}</span>
              <Avatar>
                <AvatarImage src={`https://picsum.photos/seed/${student.name.split(' ')[0]}/40/40`} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 font-medium">{student.name}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Trophy className="h-4 w-4" />
                <span className="font-semibold">{getOverallScore(student).toFixed(1)}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
