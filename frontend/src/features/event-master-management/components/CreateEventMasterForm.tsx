'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { CreateEventMasterFormContent } from './CreateEventMasterFormContent';
import type { EventMasterFormData } from '../hooks/useEventMasterManagement';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

type CreateEventMasterFormProps = {
  onSubmit: (data: EventMasterFormData) => Promise<void>;
  onCancel: () => void;
};

export const CreateEventMasterForm = ({
  onSubmit,
  onCancel,
}: CreateEventMasterFormProps) => {
  const { selectedRecruitYear } = useRecruitYear();
  const methods = useForm<EventMasterFormData>({
    defaultValues: {
      name: '',
      description: null,
      type: 'オンライン',
      recruitYearId: selectedRecruitYear?.recruitYear ?? 0,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate>
        <CreateEventMasterFormContent />
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            登録
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
