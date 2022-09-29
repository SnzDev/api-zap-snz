import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Line, Message } from '@prisma/client';

@Injectable()
export class WebHookService {
  constructor(private readonly httpService: HttpService) {}
  private logger: Logger = new Logger('WEBHOOK');

  async sendWebhook(data: Message & { line: Line }) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${data.line.webhook_url}`,
        {
          ...data,
          line: undefined,
          updated_at: new Date(data.updated_at).getTime(),
          created_at: new Date(data.created_at).getTime(),
        },
      );

      return response;
    } catch (e) {
      this.logger.log(e);
    }
  }
}
