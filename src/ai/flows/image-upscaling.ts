// Define types for the input and output, and implement the Genkit flow for upscaling an image using AI.

'use server';

/**
 * @fileOverview Image upscaling AI agent.
 *
 * - upscaleImage - A function that handles the image upscaling process.
 * - UpscaleImageInput - The input type for the upscaleImage function.
 * - UpscaleImageOutput - The return type for the upscaleImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpscaleImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to upscale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  upscaleFactor: z
    .enum(['1x', '2x'])
    .describe('The factor by which to upscale the image (1x or 2x).'),
});
export type UpscaleImageInput = z.infer<typeof UpscaleImageInputSchema>;

const UpscaleImageOutputSchema = z.object({
  upscaledPhotoDataUri: z
    .string()
    .describe(
      'The upscaled photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'"
    ),
});
export type UpscaleImageOutput = z.infer<typeof UpscaleImageOutputSchema>;

export async function upscaleImage(input: UpscaleImageInput): Promise<UpscaleImageOutput> {
  return upscaleImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'upscaleImagePrompt',
  input: {schema: UpscaleImageInputSchema},
  output: {schema: UpscaleImageOutputSchema},
  prompt: `You are an AI image upscaling tool.  You will upscale the provided image by the specified factor.

  Upscale factor: {{{upscaleFactor}}}
  Image: {{media url=photoDataUri}}
  `,
});

const upscaleImageFlow = ai.defineFlow(
  {
    name: 'upscaleImageFlow',
    inputSchema: UpscaleImageInputSchema,
    outputSchema: UpscaleImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
