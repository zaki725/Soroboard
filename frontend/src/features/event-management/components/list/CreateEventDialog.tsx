'use client';

import { Dialog } from '@/components/ui';
import { CreateEventForm } from './CreateEventForm';
import type { EventFormData } from '@/types/event';

type CreateEventDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
};

export const CreateEventDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateEventDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="イベント登録">
      <CreateEventForm onSubmit={onSubmit} onCancel={onClose} />
    </Dialog>
  );
};
