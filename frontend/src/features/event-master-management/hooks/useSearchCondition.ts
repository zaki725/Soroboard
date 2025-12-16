import { useCallback } from 'react';
import { useSearchCondition as useSearchConditionBase } from '@/hooks/useSearchCondition';

const FORM_TYPE = 'event-master';
const CURRENT_PATH = '/admin/event-master-management';

const buildUrlParams = (searchParams: URLSearchParams): string => {
  const params = new URLSearchParams();
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const page = searchParams.get('page');

  if (id) params.set('id', id);
  if (search) params.set('search', search);
  if (type) params.set('type', type);
  if (page && page !== '1') params.set('page', page);

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
