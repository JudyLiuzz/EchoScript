'use server';
/**
 * @fileOverview A Genkit flow for transcribing speech to text.
 *
 * - voiceToTextTranscription - A function that transcribes audio input into text.
 * - VoiceToTextTranscriptionInput - The input type for the voiceToTextTranscription function.
 * - VoiceToTextTranscriptionOutput - The return type for the voiceToTextTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToTextTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceToTextTranscriptionInput = z.infer<
  typeof VoiceToTextTranscriptionInputSchema
>;

const VoiceToTextTranscriptionOutputSchema = z.object({
  transcribedText: z.string().describe('The transcribed text from the audio.'),
});
export type VoiceToTextTranscriptionOutput = z.infer<
  typeof VoiceToTextTranscriptionOutputSchema
>;

export async function voiceToTextTranscription(
  input: VoiceToTextTranscriptionInput
): Promise<VoiceToTextTranscriptionOutput> {
  return voiceToTextTranscriptionFlow(input);
}

const voiceToTextTranscriptionPrompt = ai.definePrompt({
  name: 'voiceToTextTranscriptionPrompt',
  input: {schema: VoiceToTextTranscriptionInputSchema},
  output: {schema: VoiceToTextTranscriptionOutputSchema},
  prompt: `Transcribe the audio provided. Only return the transcribed text, without any additional commentary. Audio: {{media url=audioDataUri}}`,
});

const voiceToTextTranscriptionFlow = ai.defineFlow(
  {
    name: 'voiceToTextTranscriptionFlow',
    inputSchema: VoiceToTextTranscriptionInputSchema,
    outputSchema: VoiceToTextTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await voiceToTextTranscriptionPrompt(input);
    return output!;
  }
);
