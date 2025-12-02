'use client';

import { TextField, FormError, FormFooter } from '@/components/form';

type CreateEventLocationFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateEventLocationFormContent = ({
  error,
  isSubmitting,
  onClose,
}: CreateEventLocationFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="name"
        label="ロケーション名"
        placeholder="ロケーション名を入力"
        rules={{
          required: 'ロケーション名は必須です',
          minLength: {
            value: 1,
            message: 'ロケーション名は1文字以上で入力してください',
          },
        }}
      />

      <FormError error={error} />

      <FormFooter
        onCancel={onClose}
        submitLabel="作成"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
