'use client';

import { Dialog, Button } from '@/components/ui';
import type { EventMasterResponseDto } from '@/types/event-master';

type DeleteEventMasterDialogProps = {
  isOpen: boolean;
  eventMaster: EventMasterResponseDto | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
};

export const DeleteEventMasterDialog = ({
  isOpen,
  eventMaster,
  onClose,
  onConfirm,
}: DeleteEventMasterDialogProps) => {
  if (!eventMaster) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm(eventMaster.id);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="イベントマスター削除"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            削除
          </Button>
        </>
      }
    >
      <p>
        「{eventMaster.name}」を削除しますか？
        <br />
        この操作は取り消せません。
      </p>
    </Dialog>
  );
};
