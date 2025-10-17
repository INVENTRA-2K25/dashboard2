'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts';
import type { StudentAnalytics } from '@/lib/types';
import { AreaChart } from '../area-chart';

export function ChildAnalytics({ analytics }: { analytics: StudentAnalytics }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Child's Performance Analytics</CardTitle>
        <CardDescription>
          An overview of your child's academic performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="text-center font-medium">Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.performance}>
              <XAxis
                dataKey="subject"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
                formatter={(value: number) => [`${value}%`, 'Score']}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="score" position="top" formatter={(value: number) => `${value}%`} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <AreaChart
          title="Study Time"
          description="Hours spent per subject this month."
          data={analytics.timeSpent}
          dataKey="hours"
          xAxisKey="subject"
          className="border-none shadow-none p-0 -m-6"
        />
      </CardContent>
    </Card>
  );
}
