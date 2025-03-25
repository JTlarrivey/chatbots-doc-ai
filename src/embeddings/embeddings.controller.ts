import { Controller, Post, Body } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { PineconeService } from '../pinecone/pinecone.service';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly pineconeService: PineconeService,
  ) {}

  @Post('store')
  async storeEmbedding(@Body() body: { text: string; id: string }) {
    const { text, id } = body;

    try {
      // Obtener el embedding
      const embedding = await this.embeddingsService.getEmbedding(text);

      // Subir el embedding a Pinecone
      await this.pineconeService.indexDocument(id, text);

      return { message: 'Embedding almacenado exitosamente', id };
    } catch (error) {
      console.error('Error al almacenar el embedding:', error);
      throw new Error('No se pudo almacenar el embedding');
    }
  }
}
