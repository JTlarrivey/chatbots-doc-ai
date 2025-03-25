import { Controller, Get, Query } from '@nestjs/common';
import { PineconeService } from '../pinecone/pinecone.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pineconeService: PineconeService,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  @Get('process')
  async processPdf(@Query('fileName') fileName: string) {
    try {
      // Ajustar la ruta para incluir la subcarpeta 'pdfs' dentro de 'assets'
      const filePath = path.resolve(
        __dirname,
        '../../assets',
        'pdfs',
        fileName,
      );

      // Leer el archivo PDF
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);

      // El texto extraído del PDF
      const text = pdfData.text;
      console.log('Texto extraído del PDF:', text);

      // Dividir el texto en fragmentos más pequeños para que no excedan el límite de tokens
      const maxTokens = 8192; // Límite máximo de tokens del modelo
      const chunkSize = maxTokens - 1; // Dejar espacio para el margen de seguridad
      const chunks: string[] = [];

      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
      }

      console.log('Fragmentos generados:', chunks.length);

      // Verificar si se están creando fragmentos correctamente
      if (chunks.length > 1) {
        console.log(`Se dividió el texto en ${chunks.length} fragmentos.`);
      } else {
        console.log(
          'No fue necesario dividir el texto, se envió todo el contenido.',
        );
      }

      // Indexar cada fragmento de texto con un ID único para cada uno
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await this.embeddingsService.getEmbedding(chunk);

        // Usar el nombre del archivo y el índice del fragmento como ID único
        const documentId = `${fileName.split('.')[0]}_part_${i}`;
        await this.pineconeService.indexDocument(documentId, chunk);
      }

      return {
        message: 'Archivo procesado y almacenado exitosamente',
        fileName,
      };
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      return { error: 'Hubo un error al procesar el archivo' };
    }
  }
}
