import { Module } from '@nestjs/common';
import { ChatController } from '../chat/chat.controller';
import { ChatService } from '../chat/chat.service';
import { PineconeService } from '../pinecone/pinecone.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, PineconeService, EmbeddingsService],
  exports: [ChatService],
})
export class ChatModule {}
