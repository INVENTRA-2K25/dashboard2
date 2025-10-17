'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateBehaviorInsightsForParent } from '@/ai/flows/generate-behavior-insights-for-parent';
import { mockStudentData } from '@/lib/mock-data';
import { ScrollArea } from '../ui/scroll-area';

type BehaviorInsightsProps = {
  childName: string;
  initialInsights: string[];
};

export function BehaviorInsights({ childName, initialInsights }: BehaviorInsightsProps) {
  const [insights, setInsights] = useState(initialInsights);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const behavioralData = `
        Homework Status: ${mockStudentData.homework.map(h => `${h.title}: ${h.status}`).join(', ')}.
        Recent Scores: ${mockStudentData.exams.filter(e => e.score).map(e => `${e.subject}: ${e.score}`).join(', ')}.
        Teacher notes: "Alex has shown great progress in Mathematics but seems to struggle with deadlines in Literature."
      `;
      const result = await generateBehaviorInsightsForParent({ childName, behavioralData });
      setInsights(prev => [result.insights, ...prev]);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      // Add error to the top of the list
      setInsights(prev => ["Could not load new insights at this time. Please try again later.", ...prev]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Behavior Insights</CardTitle>
        <CardDescription>
          AI-powered analysis of your child's behavior and performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <ScrollArea className="h-72 w-full">
            <div className="space-y-4 pr-4">
            {insights.map((insight, index) => (
                <div key={index} className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-wrap p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">{index === 0 ? "Latest Insight" : `From ${index + 1} Refresh(es) Ago`}</p>
                    {insight}
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Generate New Insight
        </Button>
      </CardFooter>
    </Card>
  );
}
