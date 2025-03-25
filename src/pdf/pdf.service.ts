import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class PdfService {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  async processPdf(fileName: string): Promise<number[]> {
    // Construir la ruta al archivo
    const filePath = path.join(__dirname, '..', 'assets', 'pdfs', fileName);
    console.log(`Trying to access file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo ${fileName} no existe.`);
    }

    // Leer el archivo PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Extraer texto del PDF
    const text = pdfData.text;

    if (!text) {
      throw new Error(`No se pudo extraer texto del archivo ${fileName}.`);
    }

    console.log(`Extracted text: ${text.slice(0, 100)}...`); // Muestra los primeros 100 caracteres

    // Dividir el texto en fragmentos más pequeños (menos de 8192 tokens)
    const chunkSize = 8192; // Limite de tokens
    const chunks = this.splitTextIntoChunks(text, chunkSize);

    // Generar embeddings para cada fragmento
    const embeddings: number[] = [];
    for (const chunk of chunks) {
      const chunkEmbedding = await this.embeddingsService.getEmbedding(chunk);
      embeddings.push(...chunkEmbedding);
    }

    return embeddings;
  }

  // Función para dividir el texto en fragmentos
  private splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
      const chunk = text.substring(currentIndex, currentIndex + chunkSize);
      chunks.push(chunk);
      currentIndex += chunkSize;
    }

    return chunks;
  }
}
