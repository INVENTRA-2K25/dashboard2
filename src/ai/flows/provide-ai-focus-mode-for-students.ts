// This is an AI-powered learning environment to help students focus on studying.
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing an AI-powered focus mode for students.
 *
 * The flow takes a topic and desired focus level as input, and generates a tailored study guide to help students concentrate and learn effectively.
 *
 * @param {ProvideAiFocusModeForStudentsInput} input - The input to the flow, including the topic and desired focus level.
 * @returns {Promise<ProvideAiFocusModeForStudentsOutput>} - A promise that resolves to the generated study guide.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAiFocusModeForStudentsInputSchema = z.object({
  topic: z.string().describe('The topic to focus on.'),
  focusLevel: z
    .string()
    .describe(
      'The desired level of focus. It should be one of "Low", "Medium", or "High".'
    ),
});
export type ProvideAiFocusModeForStudentsInput = z.infer<
  typeof ProvideAiFocusModeForStudentsInputSchema
>;

const ProvideAiFocusModeForStudentsOutputSchema = z.object({
  studyGuide: z
    .string()
    .describe(
      'A tailored study guide to help students concentrate and learn effectively.'
    ),
});
export type ProvideAiFocusModeForStudentsOutput = z.infer<
  typeof ProvideAiFocusModeForStudentsOutputSchema
>;

export async function provideAiFocusModeForStudents(
  input: ProvideAiFocusModeForStudentsInput
): Promise<ProvideAiFocusModeForStudentsOutput> {
  return provideAiFocusModeForStudentsFlow(input);
}

const provideAiFocusModeForStudentsPrompt = ai.definePrompt({
  name: 'provideAiFocusModeForStudentsPrompt',
  input: {schema: ProvideAiFocusModeForStudentsInputSchema},
  output: {schema: ProvideAiFocusModeForStudentsOutputSchema},
  prompt: `You are an AI assistant designed to help students focus better on studying.

  Based on the topic and desired focus level, generate a tailored study guide to help students concentrate and learn effectively.

  Topic: {{{topic}}}
  Focus Level: {{{focusLevel}}}

  Study Guide:`,
});

const provideAiFocusModeForStudentsFlow = ai.defineFlow(
  {
    name: 'provideAiFocusModeForStudentsFlow',
    inputSchema: ProvideAiFocusModeForStudentsInputSchema,
    outputSchema: ProvideAiFocusModeForStudentsOutputSchema,
  },
  async input => {
    const {output} = await provideAiFocusModeForStudentsPrompt(input);
    return output!;
  }
);
