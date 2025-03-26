import { Module } from '@nestjs/common';
import { AppController } from '../app/app.controller';
import { AppService } from '../app/app.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { PineconeModule } from 'src/pinecone/pinecone.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [PineconeModule, EmbeddingsModule, PdfModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, PineconeService],
})
export class AppModule {}
