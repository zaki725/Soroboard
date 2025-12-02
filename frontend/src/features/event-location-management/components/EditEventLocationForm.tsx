'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import type { EventLocationFormData } from '../hooks/useEventLocationManagement';
import type { EventLocationResponseDto } from '@/types/event-location';
import { EditEventLocationFormContent } from './EditEventLocationFormContent';

type EditEventLocationFormProps = {
  eventLocation: EventLocationResponseDto;
  onSubmit: (
    data: EventLocationFormData,
    setError: UseFormSetError<EventLocationFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditEventLocationForm = ({
  eventLocation,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: EditEventLocationFormProps) => {
  const methods = useForm<EventLocationFormData>({
    defaultValues: {
      name: eventLocation.name,
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
        <EditEventLocationFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
