import type { StudentStatus } from '@/types/student';

export const statusLabelMap: Record<StudentStatus, string> = {
  ACTIVE: '在籍',
  SUSPENDED: '休会',
  WITHDRAWN: '退会',
};
