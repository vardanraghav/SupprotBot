// src/ai/flows/explainable-support.ts
'use server';

/**
 * @fileOverview A flow that provides empathetic support with transparent rationale.
 *
 * - explainableSupport - A function that generates empathetic replies with rationales.
 * - ExplainableSupportInput - The input type for the explainableSupport function.
 * - ExplainableSupportOutput - The return type for the explainableSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainableSupportInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  mood: z.number().describe('The user\'s current mood on a scale of 0 to 10.'),
  recentTags: z.array(z.string()).describe('An array of recent mood tags provided by the user.'),
});
export type ExplainableSupportInput = z.infer<typeof ExplainableSupportInputSchema>;

const ExplainableSupportOutputSchema = z.object({
  reply: z.string().describe('The empathetic reply to the user message.'),
  rationale: z.string().describe('The transparent rationale for the suggested reply.'),
});
export type ExplainableSupportOutput = z.infer<typeof ExplainableSupportOutputSchema>;

export async function explainableSupport(input: ExplainableSupportInput): Promise<ExplainableSupportOutput> {
  return explainableSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainableSupportPrompt',
  input: {schema: ExplainableSupportInputSchema},
  output: {schema: ExplainableSupportOutputSchema},
  prompt: `You are SupportBot, an AI assistant providing empathetic support to users.

  Respond to the user's message with an empathetic and helpful reply. Also, provide a short and transparent rationale for your suggestion. Be conversational.

  User Message: {{{message}}}
  Current Mood: {{{mood}}}
  Recent Tags: {{#each recentTags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Format your response as follows:
  Reply: [Your empathetic reply here]
  Rationale: [Your rationale for the reply here]`,
});

const explainableSupportFlow = ai.defineFlow(
  {
    name: 'explainableSupportFlow',
    inputSchema: ExplainableSupportInputSchema,
    outputSchema: ExplainableSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from prompt');
    }

    return output;
  }
);
