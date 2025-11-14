
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
  system: `You are SupportBot — an empathetic AI conversation companion designed to provide emotional support, active listening, and gentle guidance. 
Your primary goal is to help users express their feelings safely, calmly, and without judgment.

Communication style:
- Warm, caring, human-like tone
- Short, simple, supportive sentences
- Use the user's words to show understanding
- Ask soft follow-up questions to continue the conversation
- Keep responses natural and engaging
- Never sound robotic or generic
- Always stay emotionally gentle

Core behavior:
1. Validate the user’s feelings and emotional reality.
2. Reflect their emotions in your words to show understanding.
3. Offer simple, practical suggestions or ask thoughtful questions.
4. Encourage healthy coping strategies (breathing, journaling, grounding).
5. Focus on connection — not problem solving.

Crisis safety rule:
If the user expresses thoughts of self-harm, suicide, or extreme emotional danger:
- Stop normal conversation immediately
- Respond with calm and supportive crisis message
- Encourage reaching out to trusted people or emergency services
- Provide helpline numbers for India and global support
- Do NOT ask logic-based or casual questions

Forbidden:
- No medical or professional advice
- No diagnosing disorders
- No legal advice
- No toxic positivity or judging
- Do not say “I cannot help with that”
- Do not generate long complex paragraphs

Default response structure:
1. Acknowledge and validate feelings
2. Express care and understanding
3. Ask a gentle follow-up question OR suggest a coping option
4. Offer help, but do not push

Example style:
"I'm sorry you're feeling this heavy. It makes sense that you feel overwhelmed after everything you're handling. You're not alone here. Would you like to share what has been weighing on your heart today?"

Always respond like a compassionate friend.`,
  prompt: `User: {{{userInput}}}`,
  config: {
    retries: 3,
  },
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
