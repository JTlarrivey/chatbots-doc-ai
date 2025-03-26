import { Injectable } from '@nestjs/common';
import { PineconeService } from '../pinecone/pinecone.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private readonly pineconeService: PineconeService,
    private readonly embeddingsService: EmbeddingsService,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async processQuery(query: string): Promise<{ response: string }> {
    // Obtener embedding de la consulta
    const queryEmbedding = await this.embeddingsService.getEmbedding(query);

    // Buscar en Pinecone los documentos más relevantes
    const relevantDocs =
      await this.pineconeService.searchDocuments(queryEmbedding);

    // Construir el contexto dinámico
    const context = relevantDocs
      .filter((doc) => doc !== undefined)
      .map((doc) => (typeof doc === 'object' && 'text' in doc ? doc.text : ''))
      .join('\n');

    // Construir el prompt
    const prompt = `Usa la siguiente documentación para responder la consulta: \n\n${context}\n\nPregunta: ${query}\nRespuesta:`;

    // Llamar a OpenAI para generar la respuesta
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
    });

    return {
      response:
        completion.choices[0].message.content ?? 'No response available',
    };
  }
}
