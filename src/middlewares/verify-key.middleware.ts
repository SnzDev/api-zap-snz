import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { LinesService } from 'src/services/lines/lines.service';

@Injectable()
export class VerifyKeyMiddleware implements NestMiddleware {
  constructor(private linesService: LinesService) {}
  async use(req: any, res: any, next: () => void) {
    const response = await this.linesService.show(req.headers?.access_key);
    if (!response || !req.headers.access_key)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    req.access_key = response;
    next();
  }
}
