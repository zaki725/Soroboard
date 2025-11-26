import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EducationalBackgroundResponseDto } from '../../dto/educational-background/educational-background.dto';
import type { EducationType } from '../../../command/domain/educational-background/educational-background.entity';

@Injectable()
export class EducationalBackgroundDao {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    id,
  }: {
    id: string;
  }): Promise<EducationalBackgroundResponseDto | null> {
    const educationalBackground =
      await this.prisma.educationalBackground.findUnique({
        where: { id },
        include: {
          university: {
            select: {
              id: true,
              name: true,
            },
          },
          faculty: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    if (!educationalBackground) {
      return null;
    }

    return new EducationalBackgroundResponseDto({
      id: educationalBackground.id,
      interviewerId: educationalBackground.interviewerId,
      educationType: educationalBackground.educationType as EducationType,
      universityId: educationalBackground.universityId ?? undefined,
      universityName: educationalBackground.university?.name,
      facultyId: educationalBackground.facultyId ?? undefined,
      facultyName: educationalBackground.faculty?.name,
      graduationYear: educationalBackground.graduationYear ?? undefined,
      graduationMonth: educationalBackground.graduationMonth ?? undefined,
    });
  }

  async findAllByInterviewerId({
    interviewerId,
  }: {
    interviewerId: string;
  }): Promise<EducationalBackgroundResponseDto[]> {
    const educationalBackgrounds =
      await this.prisma.educationalBackground.findMany({
        where: { interviewerId },
        include: {
          university: {
            select: {
              id: true,
              name: true,
            },
          },
          faculty: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ graduationYear: 'desc' }, { graduationMonth: 'desc' }],
      });

    return educationalBackgrounds.map(
      (educationalBackground) =>
        new EducationalBackgroundResponseDto({
          id: educationalBackground.id,
          interviewerId: educationalBackground.interviewerId,
          educationType: educationalBackground.educationType as EducationType,
          universityId: educationalBackground.universityId ?? undefined,
          universityName: educationalBackground.university?.name,
          facultyId: educationalBackground.facultyId ?? undefined,
          facultyName: educationalBackground.faculty?.name,
          graduationYear: educationalBackground.graduationYear ?? undefined,
          graduationMonth: educationalBackground.graduationMonth ?? undefined,
        }),
    );
  }
}
