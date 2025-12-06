export type TeacherRole = 'OWNER' | 'STAFF';

export type TeacherResponseDto = {
  id: string;
  email: string;
  roleInSchool: TeacherRole;
  firstName: string;
  lastName: string;
  hourlyRate: number | null;
  isActive: boolean;
  memo: string | null;
  schoolId: string;
};
