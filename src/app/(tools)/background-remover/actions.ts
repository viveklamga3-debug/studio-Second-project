'use server';

import { removeBackground as removeBackgroundFlow, type RemoveBackgroundInput } from '@/ai/flows/background-removal';
import { z } from 'zod';

const actionSchema = z.object({
  photoDataUri: z.string(),
});

export async function removeBackground(values: z.infer<typeof actionSchema>) {
  try {
    const validatedInput: RemoveBackgroundInput = actionSchema.parse(values);
    
    // Artificial delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await removeBackgroundFlow(validatedInput);

    if (!result.backgroundRemovedDataUri) {
        throw new Error("The AI model failed to return an image.");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error in removeBackground action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
