'use client';

import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import {
  Dialog,
  ColorPicker,
  Button,
  CancelIcon,
  SaveIcon,
} from '@/components/ui';
import { TextField, FormError } from '@/components/form';
import type { RecruitYearFormData } from '../hooks/useRecruitYearManagement';
import type { RecruitYearResponseDto } from '@/types/recruit-year';

type EditYearDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: RecruitYearFormData,
    setError: UseFormSetError<RecruitYearFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  year: RecruitYearResponseDto | null;
};

export const EditYearDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  year,
}: EditYearDialogProps) => {
  if (!year) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="年度編集" size="md">
      <EditYearForm
        year={year}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${year.recruitYear}` : 'form-closed'}
      />
    </Dialog>
  );
};

const EditYearForm = ({
  year,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: {
  year: RecruitYearResponseDto;
  onSubmit: (
    data: RecruitYearFormData,
    setError: UseFormSetError<RecruitYearFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<RecruitYearFormData>({
    defaultValues: {
      recruitYear: year.recruitYear,
      displayName: year.displayName,
      themeColor: year.themeColor,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    void onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <EditYearFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
          year={year}
        />
      </form>
    </FormProvider>
  );
};

const EditYearFormContent = ({
  error,
  isSubmitting,
  onClose,
  year,
}: {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  year: RecruitYearResponseDto;
}) => {
  const { watch, setValue, register, formState } =
    useFormContext<RecruitYearFormData>();
  const themeColor = watch('themeColor');
  const errors = formState.errors;

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="recruit-year-display"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          年度
        </label>
        <div
          id="recruit-year-display"
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
        >
          {year.recruitYear}年度
        </div>
        <input
          type="hidden"
          {...register('recruitYear', {
            required: '年度は必須です',
            valueAsNumber: true,
          })}
        />
      </div>

      <TextField
        name="displayName"
        label="表示名"
        placeholder="表示名を入力"
        rules={{
          required: '表示名は必須です',
          minLength: {
            value: 1,
            message: '表示名は1文字以上で入力してください',
          },
        }}
      />

      <ColorPicker
        label="テーマカラー"
        value={themeColor || ''}
        onChange={(color) => {
          setValue('themeColor', color, { shouldValidate: true });
        }}
        error={errors.themeColor?.message}
        register={register('themeColor', {
          required: 'テーマカラーは必須です',
          pattern: {
            value: /^#[0-9A-Fa-f]{6}$/,
            message:
              'テーマカラーは#RRGGBB形式で入力してください（例: #1E88E5）',
          },
        })}
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
          <div className="flex items-center gap-2">
            <SaveIcon />
            <span>{isSubmitting ? '保存中...' : '保存'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
