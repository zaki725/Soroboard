'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, CancelIcon, SaveIcon } from '@/components/ui';
import { EditEventFormContent } from './EditEventFormContent';
import type { EventFormData } from '@/types/event';
import type { EventResponseDto } from '@/types/event';
import { formatDateTimeToLocal } from '@/libs/date-utils';

type EditEventFormProps = {
  event: EventResponseDto;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
};

export const EditEventForm = ({
  event,
  onSubmit,
  onCancel,
}: EditEventFormProps) => {
  const methods = useForm<EventFormData>({
    defaultValues: {
      startTime: formatDateTimeToLocal(event.startTime),
      endTime: event.endTime ? formatDateTimeToLocal(event.endTime) : '',
      notes: event.notes || '',
      eventMasterId: event.eventMasterId,
      locationId: event.locationId,
      address: event.address || '',
      interviewerIds: event.interviewerIds || [],
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
        <EditEventFormContent event={event} />
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
            更新
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
