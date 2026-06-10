import type { StudentStatus } from '../../common/enums';

export type StudentSearchParams = {
  schoolId: string;
  search?: string;
  status?: StudentStatus;
};
