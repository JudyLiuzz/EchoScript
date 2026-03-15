'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating example sentences for a new word or phrase.
 *
 * - generateNewWordExampleSentences - A function that handles the generation of example sentences.
 * - NewWordExampleSentenceGenerationInput - The input type for the generateNewWordExampleSentences function.
 * - NewWordExampleSentenceGenerationOutput - The return type for the generateNewWordExampleSentences function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NewWordExampleSentenceGenerationInputSchema = z.object({
  newWord: z
    .string()
    .describe('The new word or phrase for which to generate example sentences.'),
});
export type NewWordExampleSentenceGenerationInput = z.infer<
  typeof NewWordExampleSentenceGenerationInputSchema
>;

const NewWordExampleSentenceGenerationOutputSchema = z.object({
  exampleSentences: z
    .string()
    .describe('Example sentences demonstrating the usage of the new word or phrase.'),
});
export type NewWordExampleSentenceGenerationOutput = z.infer<
  typeof NewWordExampleSentenceGenerationOutputSchema
>;

export async function generateNewWordExampleSentences(
  input: NewWordExampleSentenceGenerationInput
): Promise<NewWordExampleSentenceGenerationOutput> {
  return newWordExampleSentenceGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'newWordExampleSentenceGenerationPrompt',
  input: { schema: NewWordExampleSentenceGenerationInputSchema },
  output: { schema: NewWordExampleSentenceGenerationOutputSchema },
  prompt: `You are an expert linguist and language educator. Your task is to generate three distinct example sentences for a given word or phrase. These sentences should clearly demonstrate the usage and context of the word/phrase, helping a language contributor better understand and document it for others. The sentences should be natural and grammatically correct.

Word/Phrase: {{{newWord}}}`,
});

const newWordExampleSentenceGenerationFlow = ai.defineFlow(
  {
    name: 'newWordExampleSentenceGenerationFlow',
    inputSchema: NewWordExampleSentenceGenerationInputSchema,
    outputSchema: NewWordExampleSentenceGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
