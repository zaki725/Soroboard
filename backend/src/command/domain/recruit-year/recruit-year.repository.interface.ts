import { RecruitYear } from '@prisma/client';

export interface IRecruitYearRepository {
  create({
    recruitYear,
    displayName,
    themeColor,
    createdBy,
    updatedBy,
  }: {
    recruitYear: number;
    displayName: string;
    themeColor: string;
    createdBy: string;
    updatedBy: string;
  }): Promise<RecruitYear>;
  update({
    recruitYear,
    displayName,
    themeColor,
    updatedBy,
  }: {
    recruitYear: number;
    displayName: string;
    themeColor: string;
    updatedBy: string;
  }): Promise<RecruitYear>;
}
