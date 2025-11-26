'use client';

import { Dialog } from '@/components/ui';
import { CreateEventMasterForm } from './CreateEventMasterForm';
import type { EventMasterFormData } from '../hooks/useEventMasterManagement';

type CreateEventMasterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventMasterFormData) => Promise<void>;
};

export const CreateEventMasterDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateEventMasterDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="イベントマスター登録">
      <CreateEventMasterForm onSubmit={onSubmit} onCancel={onClose} />
    </Dialog>
  );
};
