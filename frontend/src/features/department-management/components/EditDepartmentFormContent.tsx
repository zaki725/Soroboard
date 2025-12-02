'use client';

import { TextField, FormError, FormFooter } from '@/components/form';

type EditDepartmentFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditDepartmentFormContent = ({
  error,
  isSubmitting,
  onClose,
}: EditDepartmentFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="name"
        label="部署名"
        placeholder="部署名を入力"
        rules={{
          required: '部署名は必須です',
          minLength: {
            value: 1,
            message: '部署名は1文字以上で入力してください',
          },
        }}
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
