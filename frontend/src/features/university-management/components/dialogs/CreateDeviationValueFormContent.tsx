'use client';

import { TextField, FormError, FormFooter } from '@/components/form';

type CreateDeviationValueFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateDeviationValueFormContent = ({
  error,
  isSubmitting,
  onClose,
}: CreateDeviationValueFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="value"
        label="偏差値"
        type="number"
        placeholder="偏差値を入力"
        rules={{
          required: '偏差値は必須です',
          min: { value: 0, message: '偏差値は0以上で入力してください' },
          max: { value: 100, message: '偏差値は100以下で入力してください' },
          valueAsNumber: true,
        }}
      />

      <FormError error={error} />

      <FormFooter
        onCancel={onClose}
        submitLabel="登録"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
