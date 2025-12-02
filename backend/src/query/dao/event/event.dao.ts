import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { EventResponseDto } from '../../dto/event/event.dto';

@Injectable()
export class EventDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    ids,
    search,
    eventMasterId,
    locationId,
    interviewerId,
    startTimeFrom,
    recruitYearId,
  }: {
    ids?: string[];
    search?: string;
    eventMasterId?: string;
    locationId?: string;
    interviewerId?: string;
    startTimeFrom?: Date;
    recruitYearId: number;
  }): Promise<EventResponseDto[]> {
    const where: Prisma.EventWhereInput = {
      eventMaster: {
        recruitYearId,
      },
    };

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { eventMaster: { name: { contains: search, mode: 'insensitive' } } },
        { location: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (eventMasterId) {
      where.eventMasterId = eventMasterId;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (interviewerId) {
      where.eventInterviewers = {
        some: {
          interviewerId,
        },
      };
    }

    if (startTimeFrom) {
      where.startTime = {
        gte: startTimeFrom,
      };
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        eventMaster: true,
        location: true,
        eventInterviewers: {
          select: {
            interviewerId: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return events.map(
      (event) =>
        new EventResponseDto({
          id: event.id,
          startTime: event.startTime,
          endTime: event.endTime,
          notes: event.notes,
          eventMasterId: event.eventMasterId,
          eventMasterName: event.eventMaster.name,
          locationId: event.locationId,
          locationName: event.location.name,
          address: event.address,
          interviewerIds: event.eventInterviewers.map((ei) => ei.interviewerId),
        }),
    );
  }

  async findOne({ id }: { id: string }): Promise<EventResponseDto | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        eventMaster: true,
        location: true,
        eventInterviewers: {
          select: {
            interviewerId: true,
          },
        },
      },
    });

    if (!event) {
      return null;
    }

    return new EventResponseDto({
      id: event.id,
      startTime: event.startTime,
      endTime: event.endTime,
      notes: event.notes,
      eventMasterId: event.eventMasterId,
      eventMasterName: event.eventMaster.name,
      locationId: event.locationId,
      locationName: event.location.name,
      address: event.address,
      interviewerIds: event.eventInterviewers.map((ei) => ei.interviewerId),
    });
  }
}
