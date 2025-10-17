'use server';

/**
 * @fileOverview Generates AI-driven insights about a child's behavior for parents.
 *
 * - generateBehaviorInsightsForParent - A function that generates insights about a child's behavior.
 * - GenerateBehaviorInsightsForParentInput - The input type for the generateBehaviorInsightsForParent function.
 * - GenerateBehaviorInsightsForParentOutput - The return type for the generateBehaviorInsightsForParent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBehaviorInsightsForParentInputSchema = z.object({
  childName: z.string().describe('The name of the child.'),
  behavioralData: z.string().describe('Data describing the child\'s recent behavior, including observations and notes from teachers.'),
});
export type GenerateBehaviorInsightsForParentInput = z.infer<typeof GenerateBehaviorInsightsForParentInputSchema>;

const GenerateBehaviorInsightsForParentOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights about the child\'s behavior, including potential challenges and support strategies.'),
});
export type GenerateBehaviorInsightsForParentOutput = z.infer<typeof GenerateBehaviorInsightsForParentOutputSchema>;

export async function generateBehaviorInsightsForParent(input: GenerateBehaviorInsightsForParentInput): Promise<GenerateBehaviorInsightsForParentOutput> {
  return generateBehaviorInsightsForParentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBehaviorInsightsForParentPrompt',
  input: {schema: GenerateBehaviorInsightsForParentInputSchema},
  output: {schema: GenerateBehaviorInsightsForParentOutputSchema},
  prompt: `You are an AI assistant that analyzes a child's behavior data and generates insights for their parents.

  Based on the provided behavioral data for {{childName}}, generate insights that will help the parent understand their child's challenges and how to support their development.

  Behavioral Data: {{{behavioralData}}}

  Insights:`, 
});

const generateBehaviorInsightsForParentFlow = ai.defineFlow(
  {
    name: 'generateBehaviorInsightsForParentFlow',
    inputSchema: GenerateBehaviorInsightsForParentInputSchema,
    outputSchema: GenerateBehaviorInsightsForParentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
