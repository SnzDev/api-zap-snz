import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { MessageAck } from 'whatsapp-web.js';
import { ICreateMessage, ICreateMessageSurvey } from './types';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}
  message = this.prismaService.message;

  async createMessage(data: ICreateMessage) {
    const response = await this.message.create({ data });

    return response;
  }
  async createMessageSurvey(data: ICreateMessageSurvey) {
    const response = await this.message.create({ data });

    return response;
  }

  async findMessageByMessageId(messageId: string) {
    const response = await this.message.findFirst({
      where: { message_id: messageId },
      include: { line: true },
    });

    return response;
  }

  async findById(id: string) {
    const response = await this.message.findFirst({
      where: { id },
      include: { line: true },
    });
    return response;
  }
  async updateStatus(id: string, ack: MessageAck) {
    const response = await this.message.update({
      data: { ack },
      where: { id },
      include: { line: true },
    });
    return response;
  }

  async updateResponse(id: string, data: string) {
    const response = await this.message.update({
      data: { response: data },
      where: { id },
      include: { line: true },
    });
    return response;
  }
}
