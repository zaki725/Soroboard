'use client';

import {
  Button,
  Loading,
  Title,
  PageContainer,
  EditIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { useUniversityDetail } from '../../hooks/useUniversityDetail';
import { useUniversityDetailManagement } from '../../hooks/useUniversityDetailManagement';
import { EditUniversityInDetailDialog } from '../dialogs/EditUniversityInDetailDialog';

type UniversityDetailProps = {
  universityId: string;
};

export const UniversityDetail = ({ universityId }: UniversityDetailProps) => {
  const {
    university,
    isLoading,
    error,
    refreshUniversity,
  } = useUniversityDetail(universityId);

  const {
    isEditingUniversity,
    setIsEditingUniversity,
    handleUpdateUniversity,
    isSubmitting: isUpdatingUniversity,
    error: updateError,
  } = useUniversityDetailManagement(universityId, refreshUniversity);

  if (isLoading) {
    return (
      <PageContainer>
        <Title>大学詳細</Title>
        <Loading />
      </PageContainer>
    );
  }

  if (!university) {
    return (
      <PageContainer>
        <Title>大学詳細</Title>
        <div className="text-center py-8">
          <p className="text-gray-600">大学が見つかりませんでした</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Title>{university.name}</Title>
            <p className="text-sm text-gray-600 mt-2">ID: {university.id}</p>
            {university.rank && (
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  学校ランク: {university.rank}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditingUniversity(true)}
          >
            <div className="flex items-center gap-2">
              <EditIcon />
              <span>編集</span>
            </div>
          </Button>
        </div>

        <FormError error={error || updateError} />
      </div>

      <EditUniversityInDetailDialog
        isOpen={isEditingUniversity}
        onClose={() => setIsEditingUniversity(false)}
        university={university}
        onSubmit={handleUpdateUniversity}
        isSubmitting={isUpdatingUniversity}
        error={updateError}
      />

    </PageContainer>
  );
};
