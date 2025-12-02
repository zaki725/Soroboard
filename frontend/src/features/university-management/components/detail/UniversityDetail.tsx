'use client';

import { useState } from 'react';
import {
  Button,
  Loading,
  Title,
  PageContainer,
  PlusIcon,
  EditIcon,
  BulkIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { useUniversityDetail } from '../../hooks/useUniversityDetail';
import { useFacultyManagement } from '../../hooks/useFacultyManagement';
import { useUniversityDetailManagement } from '../../hooks/useUniversityDetailManagement';
import { useFacultyCsv } from '../../hooks/useFacultyCsv';
import { CreateFacultyDialog } from '../dialogs/CreateFacultyDialog';
import { EditFacultyDialog } from '../dialogs/EditFacultyDialog';
import { DeleteFacultyDialog } from '../dialogs/DeleteFacultyDialog';
import { CreateDeviationValueDialog } from '../dialogs/CreateDeviationValueDialog';
import { EditUniversityInDetailDialog } from '../dialogs/EditUniversityInDetailDialog';
import { FacultyList } from './FacultyList';

type UniversityDetailProps = {
  universityId: string;
};

export const UniversityDetail = ({ universityId }: UniversityDetailProps) => {
  const {
    university,
    faculties,
    isLoading,
    error,
    refreshFaculties,
    refreshUniversity,
  } = useUniversityDetail(universityId);

  const {
    isSubmitting,
    error: managementError,
    isCreatingFaculty,
    setIsCreatingFaculty,
    isCreatingDeviationValue,
    setIsCreatingDeviationValue,
    isEditingFaculty,
    setIsEditingFaculty,
    isDeletingFaculty,
    setIsDeletingFaculty,
    editingFaculty,
    setEditingFaculty,
    deletingFaculty,
    setDeletingFaculty,
    selectedFacultyId,
    setSelectedFacultyId,
    handleCreateFaculty,
    handleUpdateFaculty,
    handleDeleteFaculty,
    handleCreateDeviationValue,
  } = useFacultyManagement(universityId, refreshFaculties);

  const {
    isEditingUniversity,
    setIsEditingUniversity,
    handleUpdateUniversity,
    isSubmitting: isUpdatingUniversity,
    error: updateError,
  } = useUniversityDetailManagement(universityId, refreshUniversity);

  const [csvError, setCsvError] = useState<string | null>(null);
  const {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
    handleUploadCSV,
  } = useFacultyCsv({
    universityId,
    fetchFaculties: refreshFaculties,
  });

  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

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

        <FormError
          error={error || managementError || updateError || csvError}
        />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">学部一覧</h2>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setIsBulkDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              >
                <div className="flex items-center gap-2">
                  <BulkIcon />
                  <span>一括処理</span>
                </div>
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreatingFaculty(true)}
              >
                <div className="flex items-center gap-2">
                  <PlusIcon />
                  <span>学部を追加</span>
                </div>
              </Button>
            </div>
          </div>

          <FacultyList
            faculties={faculties}
            onEdit={(faculty) => {
              setEditingFaculty(faculty);
              setIsEditingFaculty(true);
            }}
            onDelete={(faculty) => {
              setDeletingFaculty(faculty);
              setIsDeletingFaculty(true);
            }}
          />
        </div>
      </div>

      <EditUniversityInDetailDialog
        isOpen={isEditingUniversity}
        onClose={() => setIsEditingUniversity(false)}
        university={university}
        onSubmit={handleUpdateUniversity}
        isSubmitting={isUpdatingUniversity}
        error={updateError}
      />

      <CreateFacultyDialog
        isOpen={isCreatingFaculty}
        onClose={() => setIsCreatingFaculty(false)}
        onSubmit={handleCreateFaculty}
        isSubmitting={isSubmitting}
        error={managementError}
        universityId={universityId}
      />

      <EditFacultyDialog
        isOpen={isEditingFaculty}
        onClose={() => {
          setIsEditingFaculty(false);
          setEditingFaculty(null);
        }}
        onSubmit={handleUpdateFaculty}
        isSubmitting={isSubmitting}
        error={managementError}
        faculty={editingFaculty}
      />

      <DeleteFacultyDialog
        isOpen={isDeletingFaculty}
        onClose={() => {
          setIsDeletingFaculty(false);
          setDeletingFaculty(null);
        }}
        onConfirm={async () => {
          if (deletingFaculty) {
            await handleDeleteFaculty(deletingFaculty.id);
          }
        }}
        faculty={deletingFaculty}
        isSubmitting={isSubmitting}
      />

      <CreateDeviationValueDialog
        isOpen={isCreatingDeviationValue}
        onClose={() => {
          setIsCreatingDeviationValue(false);
          setSelectedFacultyId(null);
        }}
        onSubmit={handleCreateDeviationValue}
        isSubmitting={isSubmitting}
        error={managementError}
        facultyId={selectedFacultyId || ''}
      />

      <BulkOperationDialog
        isOpen={isBulkDialogOpen}
        onClose={() => {
          setIsBulkDialogOpen(false);
          setCsvError(null);
        }}
        onDownloadTemplateCSV={handleDownloadTemplateCSV}
        onDownloadEditTemplateCSV={handleDownloadEditTemplateCSV}
        onUploadCSV={handleUploadCSV}
        onError={(err: unknown) => {
          const errorMessage =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: unknown }).message)
              : 'CSVアップロードに失敗しました';
          setCsvError(errorMessage);
        }}
      />
    </PageContainer>
  );
};
