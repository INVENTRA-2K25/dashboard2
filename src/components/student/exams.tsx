import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Exam } from '@/lib/types';

export function Exams({ exams }: { exams: Exam[] }) {
  const upcomingExams = exams.filter((exam) => !exam.score);
  const pastExams = exams.filter((exam) => exam.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exams</CardTitle>
        <CardDescription>Your upcoming tests and past results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2">Upcoming</h3>
          {upcomingExams.length > 0 ? (
            <ul className="space-y-3">
              {upcomingExams.map((exam) => (
                <li key={exam.id} className="flex justify-between items-center">
                  <span>{exam.subject}</span>
                  <span className="text-sm text-muted-foreground">{exam.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming exams. Great job!</p>
          )}
        </div>
        <Separator />
        <div>
          <h3 className="text-md font-semibold mb-2">Past Results</h3>
          {pastExams.length > 0 ? (
            <ul className="space-y-3">
              {pastExams.map((exam) => (
                <li key={exam.id} className="flex justify-between items-center">
                  <span>{exam.subject}</span>
                  <span className="font-semibold text-primary">{exam.score}/{exam.total}</span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-muted-foreground">No past exam results available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
