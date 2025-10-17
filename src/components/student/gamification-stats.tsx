import { Shield, Star, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import type { Gamification } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function GamificationStats({ gamification }: { gamification: Gamification }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Points"
        value={gamification.points.toLocaleString()}
        description="Keep up the great work!"
        icon={<Star className="h-5 w-5" />}
      />
      <StatsCard
        title="Current Streak"
        value={`${gamification.streak} Days`}
        description="Consistency is key!"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
          <Shield className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 pt-2">
            {gamification.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-sm">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
