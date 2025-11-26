'use client';

import { Button } from '@/components/ui';
import { TextField, FormError } from '@/components/form';

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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? '登録中...' : '登録'}
        </Button>
      </div>
    </div>
  );
};
