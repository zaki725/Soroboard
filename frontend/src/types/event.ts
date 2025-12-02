export type EventResponseDto = {
  id: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  eventMasterId: string;
  eventMasterName: string;
  locationId: string;
  locationName: string;
  address: string | null;
  interviewerIds?: string[];
};

export type EventFormData = {
  startTime: string;
  endTime: string;
  notes: string;
  eventMasterId: string;
  locationId: string;
  address: string;
  interviewerIds: string[];
};
