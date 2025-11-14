'use server';

/**
 * @fileOverview Summarizes weekly journal entries into a concise, 3-line insight.
 *
 * - summarizeJournal - A function that handles the journal summarization process.
 * - SummarizeJournalInput - The input type for the summarizeJournal function.
 * - SummarizeJournalOutput - The return type for the summarizeJournal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJournalInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('The user journal entries for the week, as a single string.'),
});
export type SummarizeJournalInput = z.infer<typeof SummarizeJournalInputSchema>;

const SummarizeJournalOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, 3-line summary of the user journal entries.'),
});
export type SummarizeJournalOutput = z.infer<typeof SummarizeJournalOutputSchema>;

export async function summarizeJournal(input: SummarizeJournalInput): Promise<SummarizeJournalOutput> {
  return summarizeJournalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJournalPrompt',
  input: {schema: SummarizeJournalInputSchema},
  output: {schema: SummarizeJournalOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing journal entries.
  Your task is to provide a concise, 3-line summary of the user's journal entries for the week.
  Focus on identifying the main themes, feelings, and experiences expressed in the entries.

  Journal Entries: {{{journalEntries}}}

  Summary:`,
});

const summarizeJournalFlow = ai.defineFlow(
  {
    name: 'summarizeJournalFlow',
    inputSchema: SummarizeJournalInputSchema,
    outputSchema: SummarizeJournalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
