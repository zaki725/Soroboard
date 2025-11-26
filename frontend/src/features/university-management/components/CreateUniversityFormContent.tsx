'use client';

import { Button, CancelIcon, SaveIcon } from '@/components/ui';
import { TextField, SelectField, FormError } from '@/components/form';

const rankOptions = [
  { value: '', label: '未選択' },
  { value: 'S', label: 'S' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

type CreateUniversityFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateUniversityFormContent = ({
  error,
  isSubmitting,
  onClose,
}: CreateUniversityFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="name"
        label="大学名"
        placeholder="大学名を入力"
        rules={{ required: '大学名は必須です' }}
      />

      <SelectField name="rank" label="学校ランク" options={rankOptions} />

      <FormError error={error} />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          icon={<CancelIcon />}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          icon={<SaveIcon />}
        >
          作成
        </Button>
      </div>
    </div>
  );
};
