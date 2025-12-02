'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { EventLocationFormData } from '../hooks/useEventLocationManagement';
import { CreateEventLocationFormContent } from './CreateEventLocationFormContent';

type CreateEventLocationFormProps = {
  onSubmit: (
    data: EventLocationFormData,
    setFormError: UseFormSetError<EventLocationFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateEventLocationForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: CreateEventLocationFormProps) => {
  const methods = useForm<EventLocationFormData>({
    defaultValues: {
      name: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <CreateEventLocationFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
