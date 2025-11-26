'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { EventLocationFormData } from '../hooks/useEventLocationManagement';
import type { EventLocationResponseDto } from '@/types/event-location';
import { EditEventLocationForm } from './EditEventLocationForm';

type EditEventLocationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: EventLocationFormData,
    setError: UseFormSetError<EventLocationFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  eventLocation: EventLocationResponseDto | null;
};

export const EditEventLocationDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  eventLocation,
}: EditEventLocationDialogProps) => {
  if (!eventLocation) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="ロケーション編集"
      size="md"
    >
      <EditEventLocationForm
        eventLocation={eventLocation}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${eventLocation.id}` : 'form-closed'}
      />
    </Dialog>
  );
};
