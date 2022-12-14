import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VerifyKeyMiddleware } from 'src/middlewares/verify-key.middleware';
import { MessageService } from '../../services/message/message.service';
import { LinesService } from '../../services/lines/lines.service';
import { WhatsappController } from './whatsapp.controller';
import { QrCodeGateway } from 'src/qr-code.gateway';
import { WebHookService } from 'src/services/webhook/webhook.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [WhatsappController],
  providers: [MessageService, LinesService, QrCodeGateway, WebHookService],
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
})
export class WhatsappModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyKeyMiddleware).forRoutes('whatsapp/v1');
  }
}
