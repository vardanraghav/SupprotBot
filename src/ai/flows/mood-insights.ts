'use server';
/**
 * @fileOverview Provides weekly insights into the user's mood history.
 *
 * - getMoodInsights - A function that generates mood insights.
 * - MoodInsightsInput - The input type for the getMoodInsights function.
 * - MoodInsightsOutput - The return type for the getMoodInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodInsightsInputSchema = z.object({
  moodHistory: z.array(
    z.object({
      date: z.string().describe('The date of the mood entry (ISO format).'),
      moodScore: z.number().min(0).max(10).describe('The mood score (0-10).'),
      tags: z.array(z.string()).optional().describe('Optional tags for the mood entry.'),
      notes: z.string().optional().describe('Optional notes for the mood entry.'),
    })
  ).describe('The user\'s mood history data.'),
});
export type MoodInsightsInput = z.infer<typeof MoodInsightsInputSchema>;

const MoodInsightsOutputSchema = z.object({
  averageMood: z.number().describe('The average mood score for the week.'),
  frequentTriggers: z.array(z.string()).describe('The most frequent tags/triggers for the week.'),
  notableIncidents: z.array(z.string()).describe('Descriptions of notable mood incidents for the week.'),
});
export type MoodInsightsOutput = z.infer<typeof MoodInsightsOutputSchema>;

export async function getMoodInsights(input: MoodInsightsInput): Promise<MoodInsightsOutput> {
  return moodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodInsightsPrompt',
  input: {schema: MoodInsightsInputSchema},
  output: {schema: MoodInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes mood data and provides weekly insights.

Analyze the following mood history data and provide the following:
- averageMood: The average mood score for the week.
- frequentTriggers: The most frequent tags/triggers for the week.  If there are no tags, say "No triggers identified".
- notableIncidents: Descriptions of notable mood incidents for the week, focusing on significant mood changes or specific notes. If there are no notable incidents, say "No notable incidents".

Mood History:
{{#each moodHistory}}
  - Date: {{date}}, Mood: {{moodScore}}, Tags: {{#if tags}}{{#each tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}, Notes: {{#if notes}}{{notes}}{{else}}None{{/if}}
{{/each}}`,
});

const moodInsightsFlow = ai.defineFlow(
  {
    name: 'moodInsightsFlow',
    inputSchema: MoodInsightsInputSchema,
    outputSchema: MoodInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
