export type StudentStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

export type StudentResponseDto = {
  id: string;
  studentNo: string | null;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  birthDate: Date | null;
  status: StudentStatus;
  joinedAt: Date;
  leftAt: Date | null;
  note: string | null;
  schoolId: string;
};
