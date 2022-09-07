import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLine, UpdateLine } from '../../modules/lines/dto/types';

@Injectable()
export class LinesService {
  constructor(private prismaService: PrismaService) {}
  line = this.prismaService.line;

  async create(data: CreateLine) {
    const response = await this.line.create({ data });
    return response;
  }
  async index() {
    const response = await this.line.findMany();
    return response;
  }
  async show(id: string) {
    const response = await this.line.findFirst({ where: { id } });
    return response;
  }
  async update(id: string, data: UpdateLine) {
    const response = await this.line.update({ data, where: { id } });
    return response;
  }
  async delete(id: string) {
    const response = await this.line.delete({ where: { id } });
    return response;
  }
}
