import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';

@Module({
  providers: [EmbeddingsService],
  exports: [EmbeddingsService], // Exportamos para que otros módulos puedan usarlo
})
export class EmbeddingsModule {}
