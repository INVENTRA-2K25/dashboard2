import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

const leaderboard = [
  { name: 'Maria Garcia', score: 95, avatar: 'https://picsum.photos/seed/maria/40/40' },
  { name: 'Alex Johnson', score: 91, avatar: 'https://picsum.photos/seed/alex/40/40' },
  { name: 'Chloe Wang', score: 88, avatar: 'https://picsum.photos/seed/chloe/40/40' },
  { name: 'David Smith', score: 82, avatar: 'https://picsum.photos/seed/david/40/40' },
  { name: 'Kenji Tanaka', score: 80, avatar: 'https://picsum.photos/seed/kenji/40/40' },
];

export function RankingVault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Leaderboard</CardTitle>
        <CardDescription>See how you stack up against your peers.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {leaderboard.map((student, index) => (
            <li key={student.name} className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-muted/50">
              <span className="font-bold text-lg text-muted-foreground w-6">{index + 1}</span>
              <Avatar>
                <AvatarImage src={student.avatar} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 font-medium">{student.name}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Trophy className="h-4 w-4" />
                <span className="font-semibold">{student.score}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
