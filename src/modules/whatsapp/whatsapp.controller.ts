import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Buttons, Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { GlobalService } from 'src/services/global/global.service';
import { ISendMessage, ISendMessageSurvey } from './dto/types';
import { MessageService } from 'src/services/message/message.service';

@Controller('whatsapp/v1')
export class WhatsappController {
  constructor(private messageService: MessageService) {}

  @Post('init')
  async createInstance() {
    const client = new Client({
      authStrategy: new LocalAuth({}),
      puppeteer: { headless: false },
    });
    GlobalService.instancesWhatsapp = { client };

    client.on('qr', (qr) => {
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

    client.on('message', async (msg) => {
      if (msg.type != 'buttons_response') return;

      const idMessage = msg['_data'].quotedStanzaID;
      const existsMessageId = await this.messageService.findMessageByMessageId(
        idMessage,
      );
      console.log(existsMessageId);

      if (!existsMessageId) return;

      if (existsMessageId.response) {
        return client.sendMessage(
          msg.from,
          'Agradecemos o feedback, porém sua resposta já foi computada!',
        );
      }

      if (msg.selectedButtonId === 'first_option') {
        await this.messageService.updateResponse(existsMessageId.id, msg.body);
        return client.sendMessage(msg.from, existsMessageId.first_answer);
      }

      if (msg.selectedButtonId === 'second_option')
        await this.messageService.updateResponse(existsMessageId.id, msg.body);
      return client.sendMessage(msg.from, existsMessageId.second_answer);
    });

    client.initialize();
  }

  @Post('/destroy')
  async clearInstance(@Body() body: { sessionId: string }) {
    const response = await GlobalService.instancesWhatsapp.client.destroy();
    console.log('destroyed', response);
  }

  @Post('/send/message')
  async sendMessage(@Req() req, @Body() body: ISendMessage) {
    const { message, file_url } = body;
    const media = file_url && (await MessageMedia.fromUrl(file_url));
    const phone_number = `${body.phone_number}@c.us`;

    if (file_url) {
      const responseImg =
        await GlobalService.instancesWhatsapp.client.sendMessage(
          phone_number,
          media,
          { caption: message },
        );
      return await this.messageService.createMessage({
        file_url: file_url,
        ack: responseImg.ack,
        destiny: responseImg.to,
        message_body: message,
        message_id: responseImg.id.id,
        sender: responseImg.from,
        acess_key: req?.access_key?.id,
      });
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
      acess_key: req?.access_key?.id,
    });
  }

  @Post('/send/message-survey')
  async sendMessageSurvey(@Req() req, @Body() body: ISendMessageSurvey) {
    const {
      message,
      first_option,
      first_answer,
      second_option,
      second_answer,
    } = body;
    const phone_number = `${body.phone_number}@c.us`;

    const buttons = new Buttons(message, [
      { id: 'first_option', body: first_option },
      { id: 'second_option', body: second_option },
    ]);

    const responseMsg =
      await GlobalService.instancesWhatsapp.client.sendMessage(
        phone_number,
        buttons,
      );

    return await this.messageService.createMessageSurvey({
      ack: responseMsg.ack,
      destiny: responseMsg.to,
      message_body: message,
      message_id: responseMsg.id.id,
      sender: responseMsg.from,
      first_option,
      first_answer,
      second_option,
      second_answer,
      is_survey: true,
      acess_key: req?.access_key?.id,
    });
  }

  @Get('/status')
  async getStatus() {
    const response = await GlobalService?.instancesWhatsapp?.client.getState();

    return { status: response || 'NOT_STARTED' };
  }
  @Get('/check/contact/:number')
  async numberExists(@Param('number') number) {
    const response = await GlobalService?.instancesWhatsapp?.client.getNumberId(
      number,
    );
    const status = await GlobalService?.instancesWhatsapp?.client.getState();
    if (!status) return { exists: 'NOT_STARTED' };
    return { exists: !!response };
  }

  @Get('/check/message/:id')
  async messageStatus(@Param('id') id) {
    const response = await this.messageService.findById(id);
    return response;
  }
}
