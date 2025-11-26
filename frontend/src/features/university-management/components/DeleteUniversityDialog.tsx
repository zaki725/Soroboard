'use client';

import { Dialog, Button } from '@/components/ui';
import type { UniversityResponseDto } from '@/types/university';

type DeleteUniversityDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  university: UniversityResponseDto | null;
  isSubmitting: boolean;
};

export const DeleteUniversityDialog = ({
  isOpen,
  onClose,
  onConfirm,
  university,
  isSubmitting,
}: DeleteUniversityDialogProps) => {
  if (!university) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="大学削除"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '削除中...' : '削除'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          以下の大学を削除しますか？この操作は取り消せません。
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">大学名: {university.name}</p>
        </div>
      </div>
    </Dialog>
  );
};
