import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import {
  FacultyResponseDto,
  DeviationValueResponseDto,
} from '../../dto/faculty/faculty.dto';

@Injectable()
export class FacultyDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUniversityId({
    universityId,
  }: {
    universityId: string;
  }): Promise<FacultyResponseDto[]> {
    const faculties = await this.prisma.faculty.findMany({
      where: {
        universityId,
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
        deviationValue: {
          select: {
            id: true,
            value: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return faculties.map(
      (faculty) =>
        new FacultyResponseDto({
          id: faculty.id,
          name: faculty.name,
          universityId: faculty.universityId,
          universityName: faculty.university.name,
          deviationValue: faculty.deviationValue
            ? new DeviationValueResponseDto({
                id: faculty.deviationValue.id,
                facultyId: faculty.id,
                value: faculty.deviationValue.value,
              })
            : null,
        }),
    );
  }

  async findOne({ id }: { id: string }): Promise<FacultyResponseDto | null> {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
        deviationValue: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });

    if (!faculty) {
      return null;
    }

    return new FacultyResponseDto({
      id: faculty.id,
      name: faculty.name,
      universityId: faculty.universityId,
      universityName: faculty.university.name,
      deviationValue: faculty.deviationValue
        ? new DeviationValueResponseDto({
            id: faculty.deviationValue.id,
            facultyId: faculty.id,
            value: faculty.deviationValue.value,
          })
        : null,
    });
  }
}
