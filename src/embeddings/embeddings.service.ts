import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmbeddingsService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    const originalEmbedding = response.data[0].embedding; // Dimensión original: 1536
    console.log('Dimensión original:', originalEmbedding.length);

    // Reducir la dimensionalidad a 1024 tomando los primeros 1024 valores
    let reducedEmbedding = originalEmbedding.slice(0, 1024);

    // Verificar si la longitud sigue siendo mayor que 1024 y cortar más si es necesario
    if (reducedEmbedding.length > 1024) {
      reducedEmbedding = reducedEmbedding.slice(0, 1024);
    }

    console.log('Dimensión reducida:', reducedEmbedding.length);
    return reducedEmbedding;
  }
}
