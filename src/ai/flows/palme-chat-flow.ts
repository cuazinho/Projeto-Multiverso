'use server';
/**
 * @fileOverview Fluxo de IA para a agente virtual Palme.
 * 
 * - palmeChat - Função principal que processa as mensagens do usuário.
 * - PalmeChatInput - Esquema de entrada para a conversa.
 * - PalmeChatOutput - Esquema de saída com a resposta da Palme.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PalmeChatInputSchema = z.object({
  message: z.string().describe('A mensagem ou dúvida do usuário sobre o multiverso.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('Histórico da conversa para contexto.'),
});

export type PalmeChatInput = z.infer<typeof PalmeChatInputSchema>;

const PalmeChatOutputSchema = z.object({
  text: z.string().describe('A resposta da Palme.'),
});

export type PalmeChatOutput = z.infer<typeof PalmeChatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'palmePrompt',
  input: { schema: PalmeChatInputSchema },
  output: { schema: PalmeChatOutputSchema },
  prompt: `Você é a Palme, a agente virtual inteligente do Projeto Multiverso.
Sua missão é ajudar exploradores a entenderem como manifestar novas realidades e tirar dúvidas sobre o funcionamento das dimensões.

Personalidade:
- Prestativa, educada e visionária.
- Linguagem levemente futurista, mas acolhedora.
- Você acredita firmemente que todos podem ser arquitetos de seus próprios universos.

Contexto do Projeto:
- O Projeto Multiverso permite que pessoas criem perfis de exploradores.
- Cada explorador recebe um NDI (Número de Identificação).
- O objetivo é conectar criadores de diferentes linhas temporais.

Histórico da conversa:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Usuário: {{{message}}}
Palme:`,
});

export async function palmeChat(input: PalmeChatInput): Promise<PalmeChatOutput> {
  return palmeChatFlow(input);
}

const palmeChatFlow = ai.defineFlow(
  {
    name: 'palmeChatFlow',
    inputSchema: PalmeChatInputSchema,
    outputSchema: PalmeChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Falha na comunicação dimensional com a Palme.');
    }
    return output;
  }
);
