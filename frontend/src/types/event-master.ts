import type { LocationType } from '@/constants/enums';

export type EventMasterResponseDto = {
  id: string;
  name: string;
  description: string | null;
  type: LocationType;
  recruitYearId: number;
};
