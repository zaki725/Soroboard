export class SearchConditionResponseDto {
  constructor(partial: Partial<SearchConditionResponseDto>) {
    Object.assign(this, partial);
  }

  id: string;
  formType: string;
  name: string;
  urlParams: string;
  recruitYearId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
