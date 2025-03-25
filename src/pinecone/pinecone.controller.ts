import { Controller, Post, Body } from '@nestjs/common';
import { PineconeService } from './pinecone.service';

@Controller('pinecone')
export class PineconeController {
  constructor(private readonly pineconeService: PineconeService) {}

  @Post('index-document')
  async indexDocument(@Body() body: { id: string; text: string }) {
    await this.pineconeService.indexDocument(body.id, body.text);
    return { message: 'Documento indexado exitosamente' };
  }

  @Post('index-documents')
  async indexDocuments(
    @Body() body: { documents: { id: string; text: string }[] },
  ) {
    await this.pineconeService.indexDocuments(body.documents);
    return { message: 'Documentos indexados exitosamente' };
  }
}
