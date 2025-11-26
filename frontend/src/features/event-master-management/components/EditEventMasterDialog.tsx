'use client';

import { Dialog } from '@/components/ui';
import { EditEventMasterForm } from './EditEventMasterForm';
import type { EventMasterFormData } from '../hooks/useEventMasterManagement';
import type { EventMasterResponseDto } from '@/types/event-master';

type EditEventMasterDialogProps = {
  isOpen: boolean;
  eventMaster: EventMasterResponseDto | null;
  onClose: () => void;
  onSubmit: (id: string, data: EventMasterFormData) => Promise<void>;
};

export const EditEventMasterDialog = ({
  isOpen,
  eventMaster,
  onClose,
  onSubmit,
}: EditEventMasterDialogProps) => {
  if (!eventMaster) {
    return null;
  }

  const handleSubmit = async (data: EventMasterFormData) => {
    await onSubmit(eventMaster.id, data);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="イベントマスター編集">
      <EditEventMasterForm
        eventMaster={eventMaster}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
};
