import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { PineconeService } from '../pinecone/pinecone.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, EmbeddingsService, PineconeService],
})
export class PdfModule {}
