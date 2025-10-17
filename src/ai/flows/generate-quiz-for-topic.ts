'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
    answer: z.string().describe('The correct answer from the options.'),
});

const GenerateQuizForTopicInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  questionCount: z.number().min(1).max(10).describe('The number of questions to generate.'),
});
export type GenerateQuizForTopicInput = z.infer<typeof GenerateQuizForTopicInputSchema>;

const GenerateQuizForTopicOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('An array of multiple-choice quiz questions.'),
});
export type GenerateQuizForTopicOutput = z.infer<typeof GenerateQuizForTopicOutputSchema>;

export async function generateQuizForTopic(input: GenerateQuizForTopicInput): Promise<GenerateQuizForTopicOutput> {
  return generateQuizForTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizForTopicPrompt',
  input: {schema: GenerateQuizForTopicInputSchema},
  output: {schema: GenerateQuizForTopicOutputSchema},
  prompt: `You are an AI assistant that creates quizzes. Based on the topic, generate exactly {{{questionCount}}} multiple-choice questions. For each question, provide 4 options and clearly indicate the correct answer.

  Topic: {{{topic}}}
  `, 
});

const generateQuizForTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizForTopicFlow',
    inputSchema: GenerateQuizForTopicInputSchema,
    outputSchema: GenerateQuizForTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);