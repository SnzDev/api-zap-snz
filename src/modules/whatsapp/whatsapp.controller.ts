import { Body, Controller, Get, Global, Param, Post } from '@nestjs/common';
import { Buttons, Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { qrCode } from 'qrcode-terminal';
import { GlobalService } from 'src/services/global/global.service';
import { ISendMessage } from './dto/types';
import { MessageService } from 'src/services/message/message.service';

@Controller('whatsapp/v1')
export class WhatsappController {
  constructor(private messageService: MessageService) {}

  @Post('init')
  createInstance() {
    const client = new Client({
      authStrategy: new LocalAuth({}),
      puppeteer: { headless: true },
    });
    GlobalService.instancesWhatsapp = { client };

    client.on('qr', (qr) => {
      console.log(qrCode.generate(qr, { small: true }));
      console.log(qr);
    });

    client.on('authenticated', () => {
      console.log('AUTHENTICATED');
    });

    client.on('ready', () => {
      console.log('ready');
    });

    client.on('message_ack', async (msg, ack) => {
      const existsMessageId = await this.messageService.findMessageByMessageId(
        msg.id.id,
      );

      if (existsMessageId) {
        await this.messageService.updateStatus(existsMessageId.id, ack);
        console.log('Updated Message');
      }
    });

    client.initialize();
  }

  @Post('/destroy')
  async clearInstance(@Body() body: { sessionId: string }) {
    const response = await GlobalService.instancesWhatsapp.client.destroy();
    console.log('destroyed', response);
  }

  @Post('/send/message')
  async sendMessage(@Body() body: ISendMessage) {
    const { message, file_url } = body;
    const phone_number = `${body.phone_number}@c.us`;

    if (file_url) {
      const media = await MessageMedia.fromUrl(
        'https://miro.medium.com/max/640/0*i1v1In2Tn4Stnwnl.jpg',
      );
      const responseImg =
        await GlobalService.instancesWhatsapp.client.sendMessage(
          phone_number,
          media,
        );
    }
    const responseMsg =
      await GlobalService.instancesWhatsapp.client.sendMessage(
        phone_number,
        message,
      );

    return await this.messageService.createMessage({
      file_url: file_url,
      ack: responseMsg.ack,
      destiny: responseMsg.to,
      message_body: message,
      message_id: responseMsg.id.id,
      sender: responseMsg.from,
    });
  }

  @Get('/status')
  async getStatus() {
    const response = await GlobalService.instancesWhatsapp.client.getState();

    return { status: response };
  }
  @Get('/check/contact/:number')
  async numberExists(@Param('number') number) {
    const response = await GlobalService.instancesWhatsapp.client.getNumberId(
      number,
    );
    return { exists: !!response };
  }

  @Get('/check/message/:id')
  async messageStatus(@Param('id') id) {
    const response = await this.messageService.findById(id);
    return response;
  }
}
