import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, WhatsappModule],
  controllers: [],
})
export class AppModule {}
