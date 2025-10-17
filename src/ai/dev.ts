// src/ai/dev.ts
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-behavior-notes-for-teacher.ts';
import '@/ai/flows/provide-ai-focus-mode-for-students.ts';
import '@/ai/flows/generate-behavior-insights-for-parent.ts';
import '@/ai/flows/generate-quiz-for-topic.ts'; // <-- Add this line