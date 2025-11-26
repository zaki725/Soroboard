import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { EventLocationResponseDto } from '../../dto/event-location/event-location.dto';

@Injectable()
export class EventLocationDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    ids,
    search,
  }: {
    ids?: string[];
    search?: string;
  }): Promise<EventLocationResponseDto[]> {
    const where: Prisma.EventLocationWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const eventLocations = await this.prisma.eventLocation.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return eventLocations.map(
      (eventLocation) =>
        new EventLocationResponseDto({
          id: eventLocation.id,
          name: eventLocation.name,
        }),
    );
  }

  async findOne({
    id,
  }: {
    id: string;
  }): Promise<EventLocationResponseDto | null> {
    const eventLocation = await this.prisma.eventLocation.findUnique({
      where: { id },
    });

    if (!eventLocation) {
      return null;
    }

    return new EventLocationResponseDto({
      id: eventLocation.id,
      name: eventLocation.name,
    });
  }
}
