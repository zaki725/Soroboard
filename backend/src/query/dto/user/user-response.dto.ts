import type { UserRole, Gender } from '../../../common/enums';

export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
    this.isInterviewer = partial.isInterviewer ?? false;
    this.departmentName = partial.departmentName ?? null;
  }

  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isInterviewer: boolean;
  departmentName: string | null;
}
