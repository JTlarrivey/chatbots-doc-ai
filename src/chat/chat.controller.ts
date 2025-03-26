import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  async handleQuery(@Body('query') query: string) {
    return this.chatService.processQuery(query);
  }
}
