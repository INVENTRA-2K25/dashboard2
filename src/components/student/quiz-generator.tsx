'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles } from 'lucide-react';
import { generateQuizForTopic } from '@/ai/flows/generate-quiz-for-topic';
import type { GenerateQuizForTopicOutput } from '@/ai/flows/generate-quiz-for-topic';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

export function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<GenerateQuizForTopicOutput['quiz'] | null>(null);

  const handleGenerateQuiz = async () => {
    if (!topic) return;
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuizForTopic({ topic, questionCount });
      setQuiz(result.quiz);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Quiz Generator</CardTitle>
        <CardDescription>
          Enter a topic and select the number of questions to test your knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="e.g., Photosynthesis" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <Button onClick={handleGenerateQuiz} disabled={isLoading || !topic}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="question-count">Number of Questions: {questionCount}</Label>
            <Slider
              id="question-count"
              min={1}
              max={10}
              step={1}
              value={[questionCount]}
              onValueChange={(value) => setQuestionCount(value[0])}
            />
          </div>
        </div>

        {quiz && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Generated Quiz on: {topic}</h3>
            <Accordion type="single" collapsible className="w-full">
              {quiz.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{`Question ${index + 1}: ${item.question}`}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {item.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={`p-2 rounded-md ${option === item.answer ? 'bg-green-100 dark:bg-green-900' : 'bg-muted/50'}`}>
                          {option}
                          {option === item.answer && <span className="font-bold text-green-600 dark:text-green-400 ml-2">(Correct)</span>}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}