import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewerManagement } from './useInterviewerManagement';
import { useInterviewerRegistration } from '@/features/user-management/hooks/useInterviewerRegistration';
import { useDepartmentList } from '@/features/department-management/hooks/useDepartmentList';
import { useUserList } from '@/features/user-management/hooks/useUserList';
import { useInterviewerCsv } from './useInterviewerCsv';
import { getTableColumns } from '../components/InterviewerTableColumns';

export const useInterviewerManagementPage = () => {
  const router = useRouter();
  const {
    interviewers,
    isLoading,
    error,
    setError,
    searchParams,
    handleSearch,
    handleReset,
    fetchInterviewers,
    editingInterviewer,
    deletingInterviewer,
    isSubmitting,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    startEdit,
    startDelete,
    cancelEdit,
    cancelDelete,
    handleUpdate,
    handleDelete,
  } = useInterviewerManagement();

  const interviewerRegistration = useInterviewerRegistration({
    fetchUsers: fetchInterviewers,
    setError,
  });

  const { users } = useUserList();
  const { departments } = useDepartmentList();

  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const interviewerCsv = useInterviewerCsv({
    users,
    fetchInterviewers: fetchInterviewers,
  });

  const handleRowClick = useCallback(
    (row: { userId: string }) => {
      // URLパラメータから検索条件を取得して保持
      const params = new URLSearchParams();
      if (searchParams.userId) params.set('userId', searchParams.userId);
      if (searchParams.search) params.set('search', searchParams.search);
      if (searchParams.category) params.set('category', searchParams.category);

      const queryString = params.toString();
      const baseUrl = `/admin/interviewer-management/${row.userId}`;
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      router.push(url);
    },
    [router, searchParams],
  );

  const columns = useMemo(
    () =>
      getTableColumns({
        startEdit,
        startDelete,
        handleRowClick,
        searchParams,
      }),
    [startEdit, startDelete, handleRowClick, searchParams],
  );

  const data = useMemo(
    () =>
      interviewers.map((interviewer) => ({
        userId: interviewer.userId,
        userName: interviewer.userName,
        userEmail: interviewer.userEmail,
        category: interviewer.category,
      })),
    [interviewers],
  );

  const handleCloseEditDialog = () => {
    setIsEditing(false);
    cancelEdit();
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleting(false);
    cancelDelete();
  };

  const handleConfirmDelete = async () => {
    if (deletingInterviewer) {
      await handleDelete(deletingInterviewer.userId);
    }
  };

  return {
    // データ
    interviewers,
    isLoading,
    error,
    searchParams,
    data,
    columns,
    users,
    departments,
    // 編集・削除関連
    editingInterviewer,
    deletingInterviewer,
    isSubmitting,
    isEditing,
    isDeleting,
    // CSV一括操作関連
    isBulkDialogOpen,
    setIsBulkDialogOpen,
    interviewerCsv,
    // 登録関連
    interviewerRegistration,
    // イベントハンドラー
    handleSearch,
    handleReset,
    handleUpdate,
    handleCloseEditDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    setError,
  };
};
