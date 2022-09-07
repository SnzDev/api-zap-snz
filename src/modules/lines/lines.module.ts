import { Module } from '@nestjs/common';
import { LinesService } from '../../services/lines/lines.service';
import { LinesController } from './lines.controller';

@Module({
  controllers: [LinesController],
  providers: [LinesService],
  exports: [LinesService],
})
export class LinesModule {}
