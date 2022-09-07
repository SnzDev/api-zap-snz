import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { LinesModule } from './modules/lines/lines.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [PrismaModule, WhatsappModule, LinesModule],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
