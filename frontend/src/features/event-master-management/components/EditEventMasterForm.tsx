'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { EditEventMasterFormContent } from './EditEventMasterFormContent';
import type { EventMasterFormData } from '../hooks/useEventMasterManagement';
import type { EventMasterResponseDto } from '@/types/event-master';

type EditEventMasterFormProps = {
  eventMaster: EventMasterResponseDto;
  onSubmit: (data: EventMasterFormData) => Promise<void>;
  onCancel: () => void;
};

export const EditEventMasterForm = ({
  eventMaster,
  onSubmit,
  onCancel,
}: EditEventMasterFormProps) => {
  const methods = useForm<EventMasterFormData>({
    defaultValues: {
      name: eventMaster.name,
      description: eventMaster.description,
      type: eventMaster.type,
      recruitYearId: eventMaster.recruitYearId,
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
        <EditEventMasterFormContent eventMaster={eventMaster} />
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
            更新
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
