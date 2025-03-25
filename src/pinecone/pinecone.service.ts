import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PineconeService {
  private pinecone: Pinecone;
  private indexName: string;

  constructor(private readonly embeddingsService: EmbeddingsService) {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || '';

    if (!this.indexName) {
      throw new Error('PINECONE_INDEX_NAME no está definido');
    }
  }

  async indexDocument(id: string, text: string) {
    const index = this.pinecone.Index(this.indexName);

    // Generar embedding
    const embedding = await this.embeddingsService.getEmbedding(text);
    console.log(`Embedding generado para el documento ${id}:`, embedding);

    // Verificar que la dimensión sea correcta
    if (embedding.length !== 1024) {
      throw new Error(
        `Embedding dimensions mismatch: expected 1024, got ${embedding.length}`,
      );
    }

    const vector = {
      id,
      values: embedding,
      metadata: { text },
    };

    try {
      const response = await index.upsert([vector]);
      console.log(`Documento con ID ${id} indexado exitosamente`, response);
    } catch (error) {
      console.error(`Error al indexar documento ${id}:`, error);
      throw new Error(`Error al indexar documento ${id}: ${error.message}`);
    }
  }

  async indexDocuments(documents: { id: string; text: string }[]) {
    const index = this.pinecone.Index(this.indexName);

    const vectors = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await this.embeddingsService.getEmbedding(doc.text);
        console.log(
          `Embedding generado para el documento ${doc.id}:`,
          embedding,
        );

        // Verificación de dimensión
        if (embedding.length !== 1024) {
          throw new Error(
            `Embedding dimensions mismatch: expected 1024, got ${embedding.length}`,
          );
        }

        return {
          id: doc.id,
          values: embedding,
          metadata: { text: doc.text },
        };
      }),
    );

    try {
      const response = await index.upsert(vectors);
      console.log('Documentos indexados exitosamente', response);
    } catch (error) {
      console.error('Error al indexar documentos:', error);
      throw new Error(`Error al indexar documentos: ${error.message}`);
    }
  }
}
