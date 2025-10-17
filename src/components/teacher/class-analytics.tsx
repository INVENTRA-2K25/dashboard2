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
} from 'recharts';
import type { Student } from '@/lib/types';

export function ClassAnalytics({ students }: { students: Student[] }) {
  
  const getOverallScore = (student: Student) => {
    if (!student.analytics?.performance || student.analytics.performance.length === 0) {
        return 0;
    }
    const total = student.analytics.performance.reduce((acc, p) => acc + p.score, 0);
    return total / student.analytics.performance.length;
  }

  const scoreDistribution = [
    { range: '90-100', count: students.filter(s => getOverallScore(s) >= 90).length },
    { range: '80-89', count: students.filter(s => getOverallScore(s) >= 80 && getOverallScore(s) < 90).length },
    { range: '70-79', count: students.filter(s => getOverallScore(s) >= 70 && getOverallScore(s) < 80).length },
    { range: '60-69', count: students.filter(s => getOverallScore(s) >= 60 && getOverallScore(s) < 70).length },
    { range: '<60', count: students.filter(s => getOverallScore(s) < 60).length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance Analytics</CardTitle>
        <CardDescription>Overall score distribution for your students.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <XAxis
              dataKey="range"
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
              label={{ value: 'No. of Students', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle' } }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
