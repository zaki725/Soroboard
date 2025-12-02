export type UniversityRankLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export const UniversityRankLevelValues: UniversityRankLevel[] = [
  'S',
  'A',
  'B',
  'C',
  'D',
];

export type UniversityResponseDto = {
  id: string;
  name: string;
  rank?: UniversityRankLevel;
};
