'use server';

/**
 * @fileOverview An AI agent that suggests connections between magnets.
 *
 * - suggestConnections - A function that suggests connections between magnets based on their content.
 * - SuggestConnectionsInput - The input type for the suggestConnections function.
 * - SuggestConnectionsOutput - The return type for the suggestConnections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestConnectionsInputSchema = z.object({
  magnets: z.array(
    z.object({
      id: z.string().describe('The unique identifier of the magnet.'),
      text: z.string().describe('The text content of the magnet.'),
    })
  ).describe('An array of magnet objects, each containing an id and text content.'),
});
export type SuggestConnectionsInput = z.infer<typeof SuggestConnectionsInputSchema>;

const SuggestConnectionsOutputSchema = z.array(
  z.object({
    sourceId: z.string().describe('The id of the source magnet.'),
    targetId: z.string().describe('The id of the target magnet.'),
    reason: z.string().describe('The reason for the suggested connection.'),
  })
).describe('An array of suggested connections between magnets, including the source magnet id, target magnet id, and the reason for the connection.');
export type SuggestConnectionsOutput = z.infer<typeof SuggestConnectionsOutputSchema>;

export async function suggestConnections(input: SuggestConnectionsInput): Promise<SuggestConnectionsOutput> {
  return suggestConnectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestConnectionsPrompt',
  input: {schema: SuggestConnectionsInputSchema},
  output: {schema: SuggestConnectionsOutputSchema},
  prompt: `You are an AI assistant helping users organize their ideas on a digital magnetic board.

You will receive a list of magnets, each with an ID and text content. Your task is to analyze the content of these magnets and suggest connections between them based on related ideas or concepts.

For each suggested connection, provide the source magnet ID, the target magnet ID, and a brief reason explaining the connection.

Magnets:
{{#each magnets}}
- ID: {{this.id}}, Text: {{this.text}}
{{/each}}

Suggestions (in JSON format):
`,
});

const suggestConnectionsFlow = ai.defineFlow(
  {
    name: 'suggestConnectionsFlow',
    inputSchema: SuggestConnectionsInputSchema,
    outputSchema: SuggestConnectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
