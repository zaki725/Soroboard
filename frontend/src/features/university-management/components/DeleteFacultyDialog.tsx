'use client';

import { Dialog, Button, TrashIcon } from '@/components/ui';
import type { FacultyResponseDto } from '@/types/faculty';

type DeleteFacultyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  faculty: FacultyResponseDto | null;
  isSubmitting: boolean;
};

export const DeleteFacultyDialog = ({
  isOpen,
  onClose,
  onConfirm,
  faculty,
  isSubmitting,
}: DeleteFacultyDialogProps) => {
  if (!faculty) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="学部を削除" size="md">
      <div className="space-y-6">
        <p className="text-gray-700">
          以下の学部を削除しますか？この操作は取り消せません。
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">{faculty.name}</p>
          {faculty.deviationValue && (
            <p className="text-sm text-gray-600 mt-1">
              偏差値: {faculty.deviationValue.value}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-2">
              <TrashIcon />
              <span>{isSubmitting ? '削除中...' : '削除'}</span>
            </div>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
