import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Line, Message } from '@prisma/client';

@Injectable()
export class WebHookService {
  constructor(private readonly httpService: HttpService) {}

  async sendWebhook(data: Message & { line: Line }) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${data.line.webhook_url}`,
        {
          ...data,
          line: undefined,
        },
      );

      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
