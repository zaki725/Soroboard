'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { EventLocationFormData } from '../hooks/useEventLocationManagement';
import { CreateEventLocationForm } from './CreateEventLocationForm';

type CreateEventLocationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: EventLocationFormData,
    setFormError: UseFormSetError<EventLocationFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const CreateEventLocationDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateEventLocationDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="新規ロケーション作成"
      size="md"
    >
      <CreateEventLocationForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
