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

    const embedding = await this.embeddingsService.getEmbedding(text);
    console.log(`Embedding generado para el documento ${id}:`, embedding);

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
      await index.upsert([vector]);
      console.log(`Documento con ID ${id} indexado exitosamente`);
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
        console.log(`Embedding generado para el documento ${doc.id}`);

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
      await index.upsert(vectors);
      console.log('Documentos indexados exitosamente');
    } catch (error) {
      console.error('Error al indexar documentos:', error);
      throw new Error(`Error al indexar documentos: ${error.message}`);
    }
  }

  async searchDocuments(queryEmbedding: number[], topK = 10, threshold = 0.75) {
    const index = this.pinecone.Index(this.indexName);

    if (queryEmbedding.length !== 1024) {
      throw new Error(
        `Embedding dimensions mismatch: expected 1024, got ${queryEmbedding.length}`,
      );
    }

    try {
      const result = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      console.log('Resultados de búsqueda:', result);

      return result.matches
        .filter((match) => (match.score ?? 0) >= threshold)
        .map((match) => match.metadata?.text);
    } catch (error) {
      console.error('Error en la búsqueda de documentos:', error);
      throw new Error(`Error en la búsqueda de documentos: ${error.message}`);
    }
  }
}
