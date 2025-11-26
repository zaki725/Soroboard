'use client';

import { Button, CancelIcon, SaveIcon } from '@/components/ui';
import { TextField, FormError } from '@/components/form';

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

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          icon={<CancelIcon />}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          icon={<SaveIcon />}
        >
          保存
        </Button>
      </div>
    </div>
  );
};
