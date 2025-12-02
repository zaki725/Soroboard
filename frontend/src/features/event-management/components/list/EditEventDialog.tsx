'use client';

import { Dialog } from '@/components/ui';
import { EditEventForm } from './EditEventForm';
import type { EventFormData } from '@/types/event';
import type { EventResponseDto } from '@/types/event';

type EditEventDialogProps = {
  isOpen: boolean;
  event: EventResponseDto | null;
  onClose: () => void;
  onSubmit: (id: string, data: EventFormData) => Promise<void>;
};

export const EditEventDialog = ({
  isOpen,
  event,
  onClose,
  onSubmit,
}: EditEventDialogProps) => {
  if (!event) return null;

  const handleSubmit = async (data: EventFormData) => {
    await onSubmit(event.id, data);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="イベント編集">
      <EditEventForm event={event} onSubmit={handleSubmit} onCancel={onClose} />
    </Dialog>
  );
};
