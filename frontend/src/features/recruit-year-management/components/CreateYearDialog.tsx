'use client';

import { Dialog, ColorPicker } from '@/components/ui';
import { TextField, FormError, FormFooter } from '@/components/form';
import {
  useForm,
  FormProvider,
  useFormContext,
  type UseFormSetError,
} from 'react-hook-form';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import type { RecruitYearFormData } from '../hooks/useRecruitYearManagement';

type CreateYearDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: RecruitYearFormData,
    setFormError: UseFormSetError<RecruitYearFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const CreateYearDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateYearDialogProps) => {
  const { recruitYears } = useRecruitYear();

  const calculateNextYear = () => {
    if (recruitYears.length > 0) {
      const maxYear = Math.max(...recruitYears.map((y) => y.recruitYear));
      return maxYear + 1;
    }
    // 現在の年度がない場合は、現在の年から計算
    const currentYear = new Date().getFullYear();
    return currentYear;
  };

  const nextYear = calculateNextYear();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="新規年度作成" size="md">
      <CreateYearForm
        nextYear={nextYear}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${nextYear}` : 'form-closed'}
      />
    </Dialog>
  );
};

const CreateYearForm = ({
  nextYear,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: {
  nextYear: number;
  onSubmit: (
    data: RecruitYearFormData,
    setFormError: UseFormSetError<RecruitYearFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<RecruitYearFormData>({
    defaultValues: {
      recruitYear: nextYear,
      displayName: '',
      themeColor: '#1E88E5',
    },
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CreateYearFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};

const CreateYearFormContent = ({
  error,
  isSubmitting,
  onClose,
}: {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
}) => {
  const { register, watch, setValue, formState } =
    useFormContext<RecruitYearFormData>();
  const themeColor = watch('themeColor');
  const recruitYear = watch('recruitYear');
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
          {recruitYear}年度
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

      <FormFooter
        onCancel={onClose}
        submitLabel="作成"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
