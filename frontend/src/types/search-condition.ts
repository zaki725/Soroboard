export type SearchConditionResponseDto = {
  id: string;
  formType: string;
  name: string;
  urlParams: string;
  recruitYearId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSearchConditionRequestDto = {
  formType: string;
  name: string;
  urlParams: string;
  recruitYearId?: number;
};

export type UpdateSearchConditionRequestDto = {
  id: string;
  name: string;
};
