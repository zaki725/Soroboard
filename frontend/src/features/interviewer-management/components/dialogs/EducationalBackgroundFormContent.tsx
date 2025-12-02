'use client';

import {
  SelectField,
  FormError,
  HelpTooltip,
  FormFooter,
} from '@/components/form';
import type { UniversityResponseDto } from '@/types/university';
import { useEducationalBackgroundForm } from '../../hooks/useEducationalBackgroundForm';

type EducationalBackgroundFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  universities: UniversityResponseDto[];
};

export const EducationalBackgroundFormContent = ({
  error,
  isSubmitting,
  onClose,
  universities,
}: EducationalBackgroundFormContentProps) => {
  const {
    selectedUniversityId,
    faculties,
    isLoadingFaculties,
    facultyFetchError,
    educationTypeOptions,
    universityOptions,
    facultyOptions,
    graduationYearOptions,
    graduationMonthOptions,
  } = useEducationalBackgroundForm({ universities });

  return (
    <div className="space-y-6">
      <SelectField
        name="educationType"
        label="教育タイプ"
        rules={{ required: '教育タイプは必須です' }}
        options={educationTypeOptions}
        disabled={isSubmitting}
      />

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm text-gray-700">大学</label>
          <HelpTooltip
            message="プルダウンにない場合は"
            linkText="マスター権限者で大学登録"
            linkHref="/master/university-management"
          />
        </div>
        <SelectField
          name="universityId"
          options={universityOptions}
          disabled={isSubmitting}
        />
      </div>

      <SelectField
        name="facultyId"
        label="学部"
        options={facultyOptions}
        disabled={
          isSubmitting ||
          isLoadingFaculties ||
          !selectedUniversityId ||
          selectedUniversityId === ''
        }
      />

      {facultyFetchError && (
        <p className="text-sm text-red-500">{facultyFetchError}</p>
      )}
      {selectedUniversityId &&
        faculties.length === 0 &&
        !isLoadingFaculties &&
        !facultyFetchError && (
          <p className="text-sm text-gray-500">
            この大学に学部が登録されていません
          </p>
        )}

      <SelectField
        name="graduationYear"
        label="卒業年"
        options={graduationYearOptions}
        disabled={isSubmitting}
      />

      <SelectField
        name="graduationMonth"
        label="卒業月"
        options={graduationMonthOptions}
        disabled={isSubmitting}
      />

      <FormError error={error} />

      <FormFooter
        onCancel={onClose}
        submitLabel="保存"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
