import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma, UniversityRankLevel } from '@prisma/client';
import { UniversityResponseDto } from '../../dto/university/university.dto';

@Injectable()
export class UniversityDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    ids,
    search,
    rank,
  }: {
    ids?: string[];
    search?: string;
    rank?: UniversityRankLevel;
  }): Promise<UniversityResponseDto[]> {
    const where: Prisma.UniversityWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (rank) {
      where.ranks = {
        some: {
          rank,
        },
      };
    }

    const universities = await this.prisma.university.findMany({
      where,
      include: {
        ranks: {
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });

    // DTOに変換
    const universityDtos = universities.map(
      (university) =>
        new UniversityResponseDto({
          id: university.id,
          name: university.name,
          rank: university.ranks[0]?.rank,
        }),
    );

    // ランクが高い順（S > A > B > C > D）でソート
    const rankOrder: Record<string, number> = {
      S: 0,
      A: 1,
      B: 2,
      C: 3,
      D: 4,
    };

    return universityDtos.sort((a, b) => {
      const aRank = a.rank;
      const bRank = b.rank;

      // ランクがない場合は最後に配置
      if (!aRank && !bRank) return 0;
      if (!aRank) return 1;
      if (!bRank) return -1;

      return (rankOrder[aRank] ?? 999) - (rankOrder[bRank] ?? 999);
    });
  }

  async findOne({ id }: { id: string }): Promise<UniversityResponseDto | null> {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        ranks: {
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });

    if (!university) {
      return null;
    }

    return new UniversityResponseDto({
      id: university.id,
      name: university.name,
      rank: university.ranks[0]?.rank,
    });
  }
}
