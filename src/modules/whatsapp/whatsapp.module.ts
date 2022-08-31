import { Module } from '@nestjs/common';
import { MessageService } from '../../services/message/message.service';
import { WhatsappController } from './whatsapp.controller';
@Module({
  controllers: [WhatsappController],
  providers: [MessageService],
})
export class WhatsappModule {}
