import { Module } from '@nestjs/common';
import { AppController } from '../app/app.controller';
import { AppService } from '../app/app.service';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PineconeService],
})
export class AppModule {}
