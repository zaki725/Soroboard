export type DeviationValueResponseDto = {
  id: string;
  value: number;
};

export type FacultyResponseDto = {
  id: string;
  name: string;
  universityId: string;
  universityName: string;
  deviationValue: DeviationValueResponseDto | null;
};
