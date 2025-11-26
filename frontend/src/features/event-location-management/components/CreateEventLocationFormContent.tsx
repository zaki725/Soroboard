'use client';

import { Button, CancelIcon } from '@/components/ui';
import { TextField, FormError } from '@/components/form';

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

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            <CancelIcon />
            <span>キャンセル</span>
          </div>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '作成中...' : '作成'}
        </Button>
      </div>
    </div>
  );
};
