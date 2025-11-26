export const EVENT_TYPES = {
  RECRUIT_YEAR_CREATED: 'RecruitYearCreated',
  RECRUIT_YEAR_UPDATED: 'RecruitYearUpdated',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
