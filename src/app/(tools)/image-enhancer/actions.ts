'use server';

import { upscaleImage as upscaleImageFlow, type UpscaleImageInput } from '@/ai/flows/image-upscaling';
import { z } from 'zod';

const actionSchema = z.object({
  photoDataUri: z.string(),
  upscaleFactor: z.enum(['1x', '2x']),
});

export async function upscaleImage(values: z.infer<typeof actionSchema>) {
  try {
    const validatedInput: UpscaleImageInput = actionSchema.parse(values);
    
    // Artificial delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await upscaleImageFlow(validatedInput);

    if (!result.upscaledPhotoDataUri) {
        throw new Error("The AI model failed to return an image.");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error in upscaleImage action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
