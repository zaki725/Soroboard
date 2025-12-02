'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, CancelIcon, SaveIcon } from '@/components/ui';
import { CreateEventFormContent } from './CreateEventFormContent';
import type { EventFormData } from '@/types/event';

type CreateEventFormProps = {
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
};

export const CreateEventForm = ({
  onSubmit,
  onCancel,
}: CreateEventFormProps) => {
  const methods = useForm<EventFormData>({
    defaultValues: {
      startTime: '',
      endTime: '',
      notes: '',
      eventMasterId: '',
      locationId: '',
      address: '',
      interviewerIds: [],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
    methods.reset();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate>
        <CreateEventFormContent />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={<CancelIcon />}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="primary" icon={<SaveIcon />}>
            登録
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
