import { useCallback } from 'react';
import { useSearchCondition as useSearchConditionBase } from '@/hooks/useSearchCondition';

const FORM_TYPE = 'interviewer';
const CURRENT_PATH = '/admin/interviewer-management';

const buildUrlParams = (searchParams: URLSearchParams): string => {
  const params = new URLSearchParams();
  const userId = searchParams.get('userId');
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const page = searchParams.get('page');

  if (userId) params.set('userId', userId);
  if (search) params.set('search', search);
  if (category) params.set('category', category);
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
