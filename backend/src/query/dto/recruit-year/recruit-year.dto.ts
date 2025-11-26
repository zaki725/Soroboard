export class RecruitYearResponseDto {
  constructor(partial: Partial<RecruitYearResponseDto>) {
    Object.assign(this, partial);
  }

  recruitYear: number;
  displayName: string;
  themeColor: string;
}
