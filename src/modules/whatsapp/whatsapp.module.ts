import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VerifyKeyMiddleware } from 'src/middlewares/verify-key.middleware';
import { MessageService } from '../../services/message/message.service';
import { LinesService } from '../../services/lines/lines.service';
import { WhatsappController } from './whatsapp.controller';
@Module({
  controllers: [WhatsappController],
  providers: [MessageService, LinesService],
})
export class WhatsappModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyKeyMiddleware).forRoutes('whatsapp/v1');
  }
}
