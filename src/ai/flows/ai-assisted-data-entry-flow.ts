'use server';
/**
 * @fileOverview This file implements a Genkit flow for AI-assisted data entry.
 * It helps quality control technicians pre-fill equipment details and common test
 * procedures based on partial input, speeding up report generation and improving accuracy.
 *
 * - aiAssistedDataEntry - The main function to call the AI assistant for data entry.
 * - AiAssistedDataEntryInput - The input type for the aiAssistedDataEntry function.
 * - AiAssistedDataEntryOutput - The return type for the aiAssistedDataEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedDataEntryInputSchema = z.object({
  equipmentType: z
    .string()
    .optional()
    .describe('The general type of equipment (e.g., "Pump", "Valve", "Motor").'),
  partialDescription: z
    .string()
    .optional()
    .describe('A partial natural language description of the equipment or context.'),
  serialNumber: z
    .string()
    .optional()
    .describe('The serial number of the equipment, if available.'),
  clientInfo: z
    .string()
    .optional()
    .describe('Relevant information about the client or project.'),
  operationType: z
    .enum(['recovery', 'sale', 'maintenance', 'installation'])
    .optional()
    .describe('The type of operation being performed (e.g., recovery, sale, maintenance).'),
});
export type AiAssistedDataEntryInput = z.infer<typeof AiAssistedDataEntryInputSchema>;

const AiAssistedDataEntryOutputSchema = z.object({
  suggestedEquipmentDetails: z
    .object({
      model: z.string().optional().describe('Suggested model name of the equipment.'),
      manufacturer: z.string().optional().describe('Suggested manufacturer of the equipment.'),
      specifications: z
        .array(z.string())
        .optional()
        .describe('List of key technical specifications (e.g., "Power: 10kW", "Pressure: 100 bar").'),
    })
    .optional()
    .describe('AI-suggested details about the equipment.'),
  suggestedTestProcedures: z
    .array(z.string())
    .optional()
    .describe('List of common test procedures relevant to the equipment and operation type.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('A score (0 to 1) indicating the AI\'s confidence in the suggestions.'),
});
export type AiAssistedDataEntryOutput = z.infer<typeof AiAssistedDataEntryOutputSchema>;

export async function aiAssistedDataEntry(
  input: AiAssistedDataEntryInput
): Promise<AiAssistedDataEntryOutput> {
  return aiAssistedDataEntryFlow(input);
}

const aiAssistedDataEntryPrompt = ai.definePrompt({
  name: 'aiAssistedDataEntryPrompt',
  input: {schema: AiAssistedDataEntryInputSchema},
  output: {schema: AiAssistedDataEntryOutputSchema},
  prompt: `You are an expert industrial quality control technician. Your task is to suggest and pre-fill equipment details and common test procedures based on partial input.

Analyze the following information to provide the most accurate and relevant suggestions. If you are unsure, provide fewer details or a lower confidence score.

{{#if equipmentType}}
Equipment Type: {{{equipmentType}}}
{{/if}}

{{#if partialDescription}}
Partial Description: {{{partialDescription}}}
{{/if}}

{{#if serialNumber}}
Serial Number: {{{serialNumber}}}
{{/if}}

{{#if clientInfo}}
Client Information: {{{clientInfo}}}
{{/if]}

{{#if operationType}}
Operation Type: {{{operationType}}}
{{/if}}

Based on the provided details, suggest the most likely equipment model, manufacturer, and key specifications. Also, list common test procedures that would typically be performed for this type of equipment and operation. Provide a confidence score for your suggestions. Your output MUST conform to the provided JSON schema.`,
});

const aiAssistedDataEntryFlow = ai.defineFlow(
  {
    name: 'aiAssistedDataEntryFlow',
    inputSchema: AiAssistedDataEntryInputSchema,
    outputSchema: AiAssistedDataEntryOutputSchema,
  },
  async input => {
    const {output} = await aiAssistedDataEntryPrompt(input);
    return output!;
  }
);
