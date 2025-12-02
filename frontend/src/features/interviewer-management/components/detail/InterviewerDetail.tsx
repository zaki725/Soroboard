'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Title, PageContainer, Loading, Button } from '@/components/ui';
import { FormError } from '@/components/form';
import { useInterviewerDetail } from '../../hooks/useInterviewerDetail';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useEducationalBackground } from '../../hooks/useEducationalBackground';
import { useEducationalBackgroundManagement } from '../../hooks/useEducationalBackgroundManagement';
import { useUniversityList } from '@/features/university-management/hooks/useUniversityList';
import { EducationalBackgroundDialog } from '../dialogs/EducationalBackgroundDialog';
import { DeleteEducationalBackgroundDialog } from '../dialogs/DeleteEducationalBackgroundDialog';
import { InterviewerBasicInfo } from './InterviewerBasicInfo';
import { InterviewerEducationalBackgrounds } from './InterviewerEducationalBackgrounds';
import { InterviewerContactedStudents } from './InterviewerContactedStudents';
import { InterviewerStatsCards } from './InterviewerStatsCards';
import { InterviewerAnalytics } from './InterviewerAnalytics';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';

type InterviewerDetailProps = {
  interviewerId: string;
};

export const InterviewerDetail = ({
  interviewerId,
}: InterviewerDetailProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setItems } = useBreadcrumb();
  usePageTitle('面接官詳細');
  const { interviewer, isLoading, error, fetchInterviewer } =
    useInterviewerDetail({
      interviewerId: interviewerId, // userIdとして扱う
    });

  const {
    educationalBackgrounds,
    isLoading: isLoadingEducationalBackgrounds,
    error: educationalBackgroundError,
    fetchEducationalBackgrounds,
  } = useEducationalBackground(interviewer?.userId || null);

  const {
    isSubmitting,
    error: managementError,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    editingEducationalBackground,
    setEditingEducationalBackground,
    deletingEducationalBackground,
    setDeletingEducationalBackground,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useEducationalBackgroundManagement(
    interviewer?.userId || '',
    fetchEducationalBackgrounds,
  );

  const { universities } = useUniversityList();

  const handleBack = () => {
    // URLパラメータから検索条件を取得して保持
    const queryString = searchParams.toString();
    const url = queryString
      ? `/admin/interviewer-management?${queryString}`
      : '/admin/interviewer-management';
    router.push(url);
  };

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: '面接官管理', href: '/admin/interviewer-management' },
      { label: '面接官詳細' },
    ]);
  }, [setItems]);

  useEffect(() => {
    if (interviewer?.userId) {
      void fetchEducationalBackgrounds();
    }
  }, [interviewer?.userId, fetchEducationalBackgrounds]);

  if (isLoading) {
    return (
      <PageContainer>
        <Title>面接官詳細</Title>
        <Loading />
      </PageContainer>
    );
  }

  if (error || !interviewer) {
    return (
      <PageContainer>
        <Title>面接官詳細</Title>
        <FormError error={error || '面接官が見つかりません'} />
        <div className="mt-4">
          <Button variant="outline" onClick={handleBack}>
            一覧に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  const mockContactedStudents: Array<{
    id: string;
    name: string;
    university: string;
    lastContactDate: string;
    contactCount: number;
    status: string;
  }> = [];

  const handleStartEditEducationalBackground = (
    educationalBackground: EducationalBackgroundResponseDto,
  ) => {
    setEditingEducationalBackground(educationalBackground);
    setIsEditing(true);
  };

  const handleStartDeleteEducationalBackground = (
    educationalBackground: EducationalBackgroundResponseDto,
  ) => {
    setDeletingEducationalBackground(educationalBackground);
    setIsDeleting(true);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>面接官詳細</Title>
        <Button variant="outline" onClick={handleBack}>
          一覧に戻る
        </Button>
      </div>

      <div className="space-y-6 mt-6">
        <InterviewerBasicInfo
          interviewer={interviewer}
          onUpdate={fetchInterviewer}
        />

        <InterviewerEducationalBackgrounds
          educationalBackgrounds={educationalBackgrounds}
          isLoading={isLoadingEducationalBackgrounds}
          error={educationalBackgroundError || managementError}
          onAdd={() => setIsCreating(true)}
          onEdit={handleStartEditEducationalBackground}
          onDelete={handleStartDeleteEducationalBackground}
        />

        <InterviewerContactedStudents
          contactedStudents={mockContactedStudents}
        />

        <InterviewerStatsCards />

        <InterviewerAnalytics />
      </div>

      <EducationalBackgroundDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={managementError}
        educationalBackground={null}
        universities={universities}
        isEdit={false}
      />

      <EducationalBackgroundDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingEducationalBackground(null);
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={managementError}
        educationalBackground={editingEducationalBackground}
        universities={universities}
        isEdit={true}
      />

      <DeleteEducationalBackgroundDialog
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setDeletingEducationalBackground(null);
        }}
        onConfirm={async () => {
          if (deletingEducationalBackground) {
            await handleDelete(deletingEducationalBackground.id);
          }
        }}
        educationalBackground={deletingEducationalBackground}
        isSubmitting={isSubmitting}
      />
    </PageContainer>
  );
};
