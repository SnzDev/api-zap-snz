import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Buttons, Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { GlobalService } from 'src/services/global/global.service';
import { ISendMessage, ISendMessageSurvey } from './dto/types';
import { MessageService } from 'src/services/message/message.service';
import { QrCodeGateway } from 'src/qr-code.gateway';
import { WebHookService } from '../../services/webhook/webhook.service';

@Controller('whatsapp/v1')
export class WhatsappController implements OnModuleInit {
  constructor(
    private messageService: MessageService,
    private qrCodeGateway: QrCodeGateway,
    private webhookService: WebHookService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createInstance();
  }

  @Post('init')
  async createInstance() {
    if (GlobalService.instancesWhatsapp)
      throw new HttpException(
        'CLIENT ALREADY STARTED!',
        HttpStatus.BAD_REQUEST,
      );
    const client = new Client({
      authStrategy: new LocalAuth({}),
      puppeteer: {
        headless: false,
        args: ['--no-sandbox'],
      },
    });
    GlobalService.instancesWhatsapp = { client };

    client.on('qr', (qr) => {
      console.log(qr);
      const socketQrCode = GlobalService.instancesSocketQrCode;

      if (!socketQrCode) return null;
      this.qrCodeGateway.sendQrCode(socketQrCode, qr);
    });

    client.on('authenticated', () => {
      console.log('AUTHENTICATED');
      const socketQrCode = GlobalService.instancesSocketQrCode;
      this.qrCodeGateway.sendConnected(socketQrCode);
      GlobalService.instancesSocketQrCode = null;
    });

    client.on('disconnected', async (reason) => {
      console.log(`Disconnected Whats: ${reason}`);
      GlobalService.instancesWhatsapp = null;
    });

    client.on('ready', () => {
      console.log('ready');
    });

    client.on('message_ack', async (msg, ack) => {
      const existsMessageId = await this.messageService.findMessageByMessageId(
        msg.id.id,
      );

      if (existsMessageId) {
        const response = await this.messageService.updateStatus(
          existsMessageId.id,
          ack,
        );
        console.log(`Updated From: ${response.destiny}`);

        if (!response.line.webhook_url) return;

        await this.webhookService.sendWebhook(response);

        console.log(`Webhook Send: ${response.destiny}`);
      }
    });

    client.on('message', async (msg) => {
      if (msg.type != 'buttons_response') return;

      const idMessage = msg['_data'].quotedStanzaID;
      const existsMessageId = await this.messageService.findMessageByMessageId(
        idMessage,
      );

      if (!existsMessageId) return;

      if (existsMessageId.response) {
        return client.sendMessage(
          msg.from,
          'Agradecemos o feedback, porém sua resposta já foi computada!',
        );
      }

      if (msg.selectedButtonId === 'first_option') {
        const response = await this.messageService.updateResponse(
          existsMessageId.id,
          msg.body,
        );

        client.sendMessage(msg.from, existsMessageId.first_answer);

        if (!response.line.webhook_url) return;
        this.webhookService.sendWebhook(response);

        return console.log(`Webhook Send: ${response.destiny}`);
      }

      if (msg.selectedButtonId === 'second_option') {
        const response = await this.messageService.updateResponse(
          existsMessageId.id,
          msg.body,
        );
        client.sendMessage(msg.from, existsMessageId.second_answer);

        if (!response.line.webhook_url) return;
        this.webhookService.sendWebhook(response);

        return console.log(`Webhook Send: ${response.destiny}`);
      }
    });

    client.initialize();
  }

  @Post('/destroy')
  async clearInstance() {
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException(
        'CLIENT ALREADY DISCONNECTED!',
        HttpStatus.BAD_REQUEST,
      );

    const response = await GlobalService.instancesWhatsapp.client.destroy();
    GlobalService.instancesWhatsapp = null;
    console.log('destroyed', response);
  }
  @Post('/logout')
  async logoutWhatsapp() {
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT NOT STARTED!', HttpStatus.BAD_REQUEST);

    const statusClient =
      await GlobalService?.instancesWhatsapp?.client.getState();
    if (statusClient !== 'CONNECTED')
      throw new HttpException(
        'CLIENT ALREADY DISCONNECTED!',
        HttpStatus.BAD_REQUEST,
      );

    const response = await GlobalService.instancesWhatsapp.client.logout();
    console.log('logout', response);
  }

  @Post('/send/message')
  async sendMessage(@Req() req, @Body() body: ISendMessage) {
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT DISCONNECTED!', HttpStatus.BAD_REQUEST);

    const { message, file_url, phone_number } = body;

    const phone = `${phone_number}@c.us`;

    if (file_url) {
      const media = await MessageMedia.fromUrl(file_url);
      const responseImg =
        await GlobalService.instancesWhatsapp.client.sendMessage(phone, media, {
          caption: message,
        });
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
      await GlobalService.instancesWhatsapp.client.sendMessage(phone, message);

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
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT DISCONNECTED!', HttpStatus.BAD_REQUEST);

    const {
      message,
      first_option,
      first_answer,
      second_option,
      second_answer,
      file_url,
    } = body;
    const phone_number = `${body.phone_number}@c.us`;

    const buttons = new Buttons(message, [
      { id: 'first_option', body: first_option },
      { id: 'second_option', body: second_option },
    ]);

    if (file_url) {
      const media = await MessageMedia.fromUrl(file_url);
      await GlobalService.instancesWhatsapp.client.sendMessage(
        phone_number,
        media,
      );
    }

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
      file_url,
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
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT DISCONNECTED!', HttpStatus.BAD_REQUEST);

    const response = await GlobalService?.instancesWhatsapp?.client.getState();

    if (!response && status) return { status: 'CONNECTION ON GOING!' };

    return { status: response };
  }
  @Get('/check/contact/:number')
  async numberExists(@Param('number') number) {
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT DISCONNECTED!', HttpStatus.BAD_REQUEST);

    const response = await GlobalService?.instancesWhatsapp?.client.getNumberId(
      number,
    );

    return { exists: !!response };
  }

  @Get('/check/message/:id')
  async messageStatus(@Param('id') id) {
    const status = await GlobalService?.instancesWhatsapp;
    if (!status)
      throw new HttpException('CLIENT DISCONNECTED!', HttpStatus.BAD_REQUEST);
    const response = await this.messageService.findById(id);
    return {
      ...response,
      updated_at: new Date(response.updated_at).getTime(),
      created_at: new Date(response.created_at).getTime(),
    };
  }
}
