import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { LinesModule } from './modules/lines/lines.module';
import { QrCodeGateway } from './qr-code.gateway';

@Module({
  imports: [PrismaModule, WhatsappModule, LinesModule],
  controllers: [],
  providers: [QrCodeGateway],
})
export class AppModule {}
