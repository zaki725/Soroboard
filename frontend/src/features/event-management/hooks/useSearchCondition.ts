import { useCallback } from 'react';
import { useSearchCondition as useSearchConditionBase } from '@/hooks/useSearchCondition';

const FORM_TYPE = 'event';
const CURRENT_PATH = '/admin/event-management';

const buildUrlParams = (searchParams: URLSearchParams): string => {
  const params = new URLSearchParams();
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  const eventMasterId = searchParams.get('eventMasterId');
  const locationId = searchParams.get('locationId');
  const interviewerId = searchParams.get('interviewerId');
  const startTimeFrom = searchParams.get('startTimeFrom');

  if (id) params.set('id', id);
  if (search) params.set('search', search);
  if (eventMasterId) params.set('eventMasterId', eventMasterId);
  if (locationId) params.set('locationId', locationId);
  if (interviewerId) params.set('interviewerId', interviewerId);
  if (startTimeFrom) params.set('startTimeFrom', startTimeFrom);

  return params.toString();
};

export const useSearchCondition = () => {
  const buildUrlParamsFn = useCallback(
    (params: URLSearchParams) => buildUrlParams(params),
    [],
  );

  return useSearchConditionBase({
    formType: FORM_TYPE,
    currentPath: CURRENT_PATH,
    buildUrlParams: buildUrlParamsFn,
  });
};
