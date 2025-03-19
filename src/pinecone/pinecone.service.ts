import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PineconeService implements OnModuleInit {
  private pinecone: Pinecone;

  async onModuleInit() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });

    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error('PINECONE_INDEX_NAME no está definido');
    }

    const index = this.pinecone.Index(indexName);

    console.log(`Conectado al índice: ${indexName}`);

    const indexStats = await index.describeIndexStats();
    console.log('Estadísticas del índice:', indexStats);
  }
}
