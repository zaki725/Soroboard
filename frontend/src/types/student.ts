export type StudentStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

export type StudentResponseDto = {
  id: string;
  studentNo: string | null;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  birthDate: string | null;
  status: StudentStatus;
  joinedAt: string;
  leftAt: string | null;
  note: string | null;
  schoolId: string;
};
