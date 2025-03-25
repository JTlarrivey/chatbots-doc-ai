import { Module } from '@nestjs/common';
import { PineconeService } from './pinecone.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { PineconeController } from '../pinecone/pinecone.controller';

@Module({
  imports: [EmbeddingsModule],
  providers: [PineconeService],
  controllers: [PineconeController],
  exports: [PineconeService],
})
export class PineconeModule {}
