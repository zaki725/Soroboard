'use client';

import { Dialog, Button, TrashIcon } from '@/components/ui';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';

type DeleteEducationalBackgroundDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  educationalBackground: EducationalBackgroundResponseDto | null;
  isSubmitting: boolean;
};

export const DeleteEducationalBackgroundDialog = ({
  isOpen,
  onClose,
  onConfirm,
  educationalBackground,
  isSubmitting,
}: DeleteEducationalBackgroundDialogProps) => {
  if (!educationalBackground) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  const educationDisplay = [
    educationalBackground.educationType,
    educationalBackground.universityName,
    educationalBackground.facultyName,
    educationalBackground.graduationYear &&
    educationalBackground.graduationMonth
      ? `${educationalBackground.graduationYear}年${educationalBackground.graduationMonth}月`
      : educationalBackground.graduationYear
        ? `${educationalBackground.graduationYear}年`
        : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="学歴を削除" size="md">
      <div className="space-y-6">
        <p className="text-gray-700">
          以下の学歴を削除しますか？この操作は取り消せません。
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">{educationDisplay || '学歴情報'}</p>
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
