'use client';

import { SelectField, FormError, FormFooter } from '@/components/form';
import { useMemo } from 'react';
import type { SelectOption } from '@/components/ui';
import type { DepartmentResponseDto } from '@/types/department';

type EditInterviewerFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  departments: DepartmentResponseDto[];
};

export const EditInterviewerFormContent = ({
  error,
  isSubmitting,
  onClose,
  departments,
}: EditInterviewerFormContentProps) => {
  const departmentOptions: SelectOption[] = useMemo(() => {
    return departments.map((department) => ({
      value: department.id,
      label: department.name,
    }));
  }, [departments]);

  return (
    <div className="space-y-6">
      <SelectField
        name="departmentId"
        label="部署"
        rules={{
          required: '部署は必須です',
        }}
        options={departmentOptions}
        disabled={isSubmitting || departmentOptions.length === 0}
      />

      {departmentOptions.length === 0 && (
        <p className="text-sm text-gray-500">
          部署が登録されていません。先に部署を登録してください。
        </p>
      )}

      <FormError error={error} />

      <FormFooter
        onCancel={onClose}
        submitLabel="保存"
        isSubmitting={isSubmitting}
        disabled={departmentOptions.length === 0}
      />
    </div>
  );
};
