'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { generateQuizForTopic } from '@/ai/flows/generate-quiz-for-topic';
import type { GenerateQuizForTopicOutput, GenerateQuizForTopicInput } from '@/ai/flows/generate-quiz-for-topic';
import { Slider } from '../ui/slider';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<GenerateQuizForTopicOutput['quiz'] | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!topic) return;
    setIsLoading(true);
    setQuiz(null);
    setUserAnswers([]);
    setIsSubmitted(false);
    try {
      const result = await generateQuizForTopic({ topic, questionCount });
      setQuiz(result.quiz);
      setUserAnswers(new Array(result.quiz.length).fill(''));
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    }
    setIsLoading(false);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    let newScore = 0;
    quiz.forEach((q, index) => {
      if (q.answer === userAnswers[index]) {
        newScore++;
      }
    });
    setScore(newScore);
    setIsSubmitted(true);

    if (user) {
        try {
            await addDocumentNonBlocking(collection(firestore, `students/${user.uid}/quiz_results`), {
                topic,
                score: newScore,
                total: quiz.length,
                date: new Date().toISOString(),
            });
            toast({ title: 'Quiz Submitted!', description: `Your score of ${newScore}/${quiz.length} has been saved.` });
        } catch (error) {
            console.error("Error saving quiz result:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save your quiz result.' });
        }
    }
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
            <h3 className="text-lg font-semibold mb-4">Quiz on: {topic}</h3>
            {quiz.map((item, index) => (
              <div key={index} className="mb-6">
                <p className="font-semibold mb-2">{`${index + 1}. ${item.question}`}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} disabled={isSubmitted}>
                  {item.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                      <Label htmlFor={`q${index}-o${optionIndex}`} className={
                        isSubmitted && option === item.answer ? 'text-green-600' :
                        isSubmitted && option === userAnswers[index] && option !== item.answer ? 'text-red-600' : ''
                      }>
                        {option}
                      </Label>
                      {isSubmitted && option === item.answer && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {isSubmitted && option === userAnswers[index] && option !== item.answer && <XCircle className="h-4 w-4 text-red-600" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            {!isSubmitted ? (
                <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
            ) : (
                <div className='p-4 bg-muted rounded-md'>
                    <h4 className='text-xl font-bold'>Quiz Complete!</h4>
                    <p className='text-lg'>Your score: <span className='font-bold'>{score} / {quiz.length}</span></p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}