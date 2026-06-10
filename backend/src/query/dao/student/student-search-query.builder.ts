import type { Prisma } from '@prisma/client';
import type { StudentSearchParams } from '../../types/student.types';

export const buildStudentSearchWhere = ({
  schoolId,
  search,
  status,
}: StudentSearchParams): Prisma.StudentWhereInput => {
  const keyword = search?.trim();

  return {
    schoolId,
    ...(status ? { status } : {}),
    ...(keyword
      ? {
        OR: [
          { studentNo: { contains: keyword } },
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { firstNameKana: { contains: keyword } },
          { lastNameKana: { contains: keyword } },
        ],
      }
    : {}),
};
};
