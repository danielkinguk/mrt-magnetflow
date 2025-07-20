'use server';

import { suggestConnections, SuggestConnectionsInput } from '@/ai/flows/suggest-connections';

export async function getAiSuggestions(input: SuggestConnectionsInput) {
  try {
    const suggestions = await suggestConnections(input);
    return { success: true, suggestions };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return { success: false, error: 'Failed to get AI suggestions.' };
  }
}
