'use client';

import { Button, CancelIcon, SaveIcon } from '@/components/ui';
import { TextField, FormError } from '@/components/form';

type EditFacultyFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditFacultyFormContent = ({
  error,
  isSubmitting,
  onClose,
}: EditFacultyFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="name"
        label="学部名"
        placeholder="学部名を入力"
        rules={{ required: '学部名は必須です' }}
      />

      <TextField
        name="deviationValue"
        label="偏差値"
        type="number"
        placeholder="偏差値を入力（0-100）"
        rules={{
          min: {
            value: 0,
            message: '偏差値は0以上である必要があります',
          },
          max: {
            value: 100,
            message: '偏差値は100以下である必要があります',
          },
          validate: (value) => {
            if (value === '' || value === null || value === undefined) {
              return true; // 空欄は許可
            }
            const numValue = Number(value);
            if (Number.isNaN(numValue)) {
              return '偏差値は数値である必要があります';
            }
            if (numValue < 0 || numValue > 100) {
              return '偏差値は0-100の範囲で入力してください';
            }
            return true;
          },
        }}
      />

      <FormError error={error} />

      <div className="flex justify-end gap-4">
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
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          <div className="flex items-center gap-2">
            <SaveIcon />
            <span>{isSubmitting ? '保存中...' : '保存'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
