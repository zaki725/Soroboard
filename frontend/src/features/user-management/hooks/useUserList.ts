import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { DEFAULT_PAGE_SIZE } from '@/constants/page';
import type {
  UserListResponseDto,
  UserResponseDto,
  UserRole,
  Gender,
} from '@/types/user';

type UserSearchFormData = {
  id: string;
  search: string;
  role: UserRole | '';
  gender: Gender | '';
  departmentId: string;
};

export const useUserList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setItems } = useBreadcrumb();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから検索条件とページを取得
  const getSearchParamsFromUrl = useCallback((): UserSearchFormData & {
    page: number;
  } => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      role: (searchParams.get('role') as UserRole | '') || '',
      gender: (searchParams.get('gender') as Gender | '') || '',
      departmentId: searchParams.get('departmentId') || '',
      page: Number(searchParams.get('page')) || 1,
    };
  }, [searchParams]);

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: 'ユーザー管理' }]);
  }, [setItems]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = getSearchParamsFromUrl();
      const apiParams = new URLSearchParams({
        page: params.page.toString(),
        pageSize: DEFAULT_PAGE_SIZE.toString(),
      });

      if (params.id) {
        apiParams.append('id', params.id);
      }
      if (params.search) {
        apiParams.append('search', params.search);
      }
      if (params.role) {
        apiParams.append('role', params.role);
      }
      if (params.gender) {
        apiParams.append('gender', params.gender);
      }
      if (params.departmentId) {
        apiParams.append('departmentId', params.departmentId);
      }

      const data = await apiClient<UserListResponseDto>(
        `/users?${apiParams.toString()}`,
      );
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        errorMessages.userListFetchFailed,
      );
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParamsFromUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUrlParams = useCallback(
    (params: UserSearchFormData, pageNum: number) => {
      const urlParams = new URLSearchParams();
      if (params.id) urlParams.set('id', params.id);
      if (params.search) urlParams.set('search', params.search);
      if (params.role) urlParams.set('role', params.role);
      if (params.gender) urlParams.set('gender', params.gender);
      if (params.departmentId)
        urlParams.set('departmentId', params.departmentId);
      if (pageNum > 1) urlParams.set('page', pageNum.toString());

      const queryString = urlParams.toString();
      const url = queryString
        ? `/master/user-management?${queryString}`
        : '/master/user-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: UserSearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data, 1);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/master/user-management');
  };

  const handlePageChange = (newPage: number) => {
    const currentParams = getSearchParamsFromUrl();
    updateUrlParams(
      {
        id: currentParams.id,
        search: currentParams.search,
        role: currentParams.role,
        gender: currentParams.gender,
        departmentId: currentParams.departmentId,
      },
      newPage,
    );
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    users,
    total,
    page: currentSearchParams.page,
    isLoading,
    error,
    setError,
    handleSearch,
    handleReset,
    setPage: handlePageChange,
    searchParams: {
      id: currentSearchParams.id,
      search: currentSearchParams.search,
      role: currentSearchParams.role,
      gender: currentSearchParams.gender,
      departmentId: currentSearchParams.departmentId,
    },
    fetchUsers,
  };
};
