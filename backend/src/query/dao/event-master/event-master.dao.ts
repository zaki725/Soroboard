import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { EventMasterResponseDto } from '../../dto/event-master/event-master.dto';

@Injectable()
export class EventMasterDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    ids,
    search,
    recruitYearId,
    type,
  }: {
    ids?: string[];
    search?: string;
    recruitYearId: number;
    type?: string;
  }): Promise<EventMasterResponseDto[]> {
    const where: Prisma.EventMasterWhereInput = {
      recruitYearId,
    };

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.type = type as 'オンライン' | '対面' | 'オンライン_対面';
    }

    const eventMasters = await this.prisma.eventMaster.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return eventMasters.map(
      (eventMaster) =>
        new EventMasterResponseDto({
          id: eventMaster.id,
          name: eventMaster.name,
          description: eventMaster.description,
          type: eventMaster.type,
          recruitYearId: eventMaster.recruitYearId,
        }),
    );
  }

  async findOne({
    id,
  }: {
    id: string;
  }): Promise<EventMasterResponseDto | null> {
    const eventMaster = await this.prisma.eventMaster.findUnique({
      where: { id },
    });

    if (!eventMaster) {
      return null;
    }

    return new EventMasterResponseDto({
      id: eventMaster.id,
      name: eventMaster.name,
      description: eventMaster.description,
      type: eventMaster.type,
      recruitYearId: eventMaster.recruitYearId,
    });
  }
}
