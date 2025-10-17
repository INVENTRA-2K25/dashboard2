'use server';
/**
 * @fileOverview AI-powered behavior notes generator for teachers.
 *
 * - generateAiBehaviorNotesForTeacher - A function that generates AI behavior notes for teachers.
 * - GenerateAiBehaviorNotesForTeacherInput - The input type for the generateAiBehaviorNotesForTeacher function.
 * - GenerateAiBehaviorNotesForTeacherOutput - The return type for the generateAiBehaviorNotesForTeacher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiBehaviorNotesForTeacherInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  classDetails: z.string().describe('Details about the class and subject.'),
  behavioralObservations: z.string().describe('Detailed observations of the student’s behavior in class.'),
});
export type GenerateAiBehaviorNotesForTeacherInput = z.infer<typeof GenerateAiBehaviorNotesForTeacherInputSchema>;

const GenerateAiBehaviorNotesForTeacherOutputSchema = z.object({
  behaviorNotes: z.string().describe('AI-generated notes on the student’s behavior, identifying patterns and offering potential strategies.'),
});
export type GenerateAiBehaviorNotesForTeacherOutput = z.infer<typeof GenerateAiBehaviorNotesForTeacherOutputSchema>;

export async function generateAiBehaviorNotesForTeacher(input: GenerateAiBehaviorNotesForTeacherInput): Promise<GenerateAiBehaviorNotesForTeacherOutput> {
  return generateAiBehaviorNotesForTeacherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiBehaviorNotesForTeacherPrompt',
  input: {schema: GenerateAiBehaviorNotesForTeacherInputSchema},
  output: {schema: GenerateAiBehaviorNotesForTeacherOutputSchema},
  prompt: `You are an AI assistant designed to help teachers by generating insightful behavior notes for students.

  Based on the provided information, identify patterns in the student's behavior and suggest potential strategies for the teacher to use.

  Student Name: {{{studentName}}}
  Class Details: {{{classDetails}}}
  Behavioral Observations: {{{behavioralObservations}}}

  Generate a concise note summarizing the student's behavior and potential interventions:
  `,
});

const generateAiBehaviorNotesForTeacherFlow = ai.defineFlow(
  {
    name: 'generateAiBehaviorNotesForTeacherFlow',
    inputSchema: GenerateAiBehaviorNotesForTeacherInputSchema,
    outputSchema: GenerateAiBehaviorNotesForTeacherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
