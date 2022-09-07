import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateLine, UpdateLine } from './dto/types';
import { LinesService } from '../../services/lines/lines.service';

@Controller('line')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Post()
  async store(@Body() body: CreateLine) {
    const response = await this.linesService.create(body);

    return response;
  }
  @Get()
  async index() {
    const response = await this.linesService.index();

    return response;
  }
  @Get('/:id')
  async show(@Param('id') id: string) {
    const response = await this.linesService.show(id);

    return response;
  }
  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateLine) {
    const response = await this.linesService.update(id, body);

    return response;
  }
}
