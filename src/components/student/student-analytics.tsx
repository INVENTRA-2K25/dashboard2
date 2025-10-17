'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { StudentAnalytics as StudentAnalyticsType } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

export function StudentAnalytics({ analytics }: { analytics: StudentAnalyticsType }) {
    const chartConfig = {
        score: {
          label: 'Score',
          color: 'hsl(var(--primary))',
        },
        hours: {
            label: 'Hours',
            color: 'hsl(var(--accent))',
        }
      };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>An overview of your academic performance and study habits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Overall Progress</h3>
          <Progress value={analytics.progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-1">{analytics.progress}% towards your goals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-sm font-medium mb-2 text-center">Performance by Subject</h3>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={analytics.performance} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="subject"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-center">Time Spent by Subject (hours)</h3>
                 <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={analytics.timeSpent} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="subject"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
