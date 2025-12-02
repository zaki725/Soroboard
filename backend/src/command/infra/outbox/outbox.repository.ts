import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Outbox, Prisma } from '@prisma/client';

@Injectable()
export class OutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    eventType,
    payload,
  }: {
    eventType: string;
    payload: Prisma.InputJsonValue;
  }): Promise<Outbox> {
    return await this.prisma.outbox.create({
      data: {
        eventType,
        payload,
        status: 'pending',
      },
    });
  }
}
