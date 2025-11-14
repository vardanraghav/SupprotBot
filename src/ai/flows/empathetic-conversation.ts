'use server';

/**
 * @fileOverview Implements an empathetic conversation flow using Genkit and
 * the GPT-4o model. The flow uses a tool to incorporate information and
 * aims to provide supportive and validating responses to user inputs.
 *
 * - empatheticConversation - The function to initiate the empathetic conversation flow.
 * - EmpatheticConversationInput - The input type for the empatheticConversation function.
 * - EmpatheticConversationOutput - The output type for the empatheticConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticConversationInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  moodScore: z.number().optional().describe('The user provided mood score.'),
  moodTags: z.array(z.string()).optional().describe('The user provided mood tags.'),
  moodNotes: z.string().optional().describe('Any additional notes on current mood.'),
});
export type EmpatheticConversationInput = z.infer<
  typeof EmpatheticConversationInputSchema
>;

const EmpatheticConversationOutputSchema = z.object({
  response: z.string().describe('The empathetic response from the AI.'),
  rationale: z
    .string()
    .describe('The rationale behind the AI response, explaining the reasoning.'),
});
export type EmpatheticConversationOutput = z.infer<
  typeof EmpatheticConversationOutputSchema
>;

export async function empatheticConversation(
  input: EmpatheticConversationInput
): Promise<EmpatheticConversationOutput> {
  return empatheticConversationFlow(input);
}

const provideContextTool = ai.defineTool({
  name: 'provideContext',
  description: 'Provides relevant information based on the user input, mood, and tags.',
  inputSchema: z.object({
    userInput: z.string().describe('The user input message.'),
    moodScore: z.number().optional().describe('The user provided mood score.'),
    moodTags: z.array(z.string()).optional().describe('The user provided mood tags.'),
    moodNotes: z.string().optional().describe('Any additional notes on current mood.'),
  }),
  outputSchema: z.string().describe('Relevant information to aid the LLM.'),
},
async (input) => {
  // Placeholder implementation - replace with actual data retrieval logic
  let context = ``;

  if (input.moodScore) {
    context += `\nUser provided a mood score of ${input.moodScore}.`;
  }
  if (input.moodTags && input.moodTags.length > 0) {
    context += `\nUser provided the following mood tags: ${input.moodTags.join(', ')}.`;
  }
  if (input.moodNotes) {
    context += `\nUser provided the following mood notes: ${input.moodNotes}.`;
  }

  return context;
});

const empatheticConversationPrompt = ai.definePrompt({
  name: 'empatheticConversationPrompt',
  input: {schema: EmpatheticConversationInputSchema},
  output: {schema: EmpatheticConversationOutputSchema},
  tools: [provideContextTool],
  system: `You are SupportBot, an AI assistant designed to provide empathetic and supportive conversations.
    Adhere to emotional intelligence principles. Validate the user's feelings and encourage safe coping strategies.
    Incorporate information from the provideContext tool to tailor your response.
    Each response should include a short, transparent rationale explaining the reasoning.

    For example: "I suggested breathing because your message included 'overwhelmed' and your last mood was 3/10."
    ALWAYS mention the rationale.
  `,
  prompt: `User: {{{userInput}}}\n\nContext: {{await provideContextTool({userInput: userInput, moodScore: moodScore, moodTags: moodTags, moodNotes: moodNotes})}}\n\nResponse:`, 
});

const empatheticConversationFlow = ai.defineFlow(
  {
    name: 'empatheticConversationFlow',
    inputSchema: EmpatheticConversationInputSchema,
    outputSchema: EmpatheticConversationOutputSchema,
  },
  async input => {
    const {output} = await empatheticConversationPrompt(input);
    return output!;
  }
);
