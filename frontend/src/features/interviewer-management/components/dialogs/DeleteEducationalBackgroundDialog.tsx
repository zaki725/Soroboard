'use client';

import { Dialog } from '@/components/ui';
import { DeleteDialogFooter } from '@/components/form';
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

  const graduationDisplay = (() => {
    if (
      educationalBackground.graduationYear &&
      educationalBackground.graduationMonth
    ) {
      return `${educationalBackground.graduationYear}年${educationalBackground.graduationMonth}月`;
    }
    if (educationalBackground.graduationYear) {
      return `${educationalBackground.graduationYear}年`;
    }
    return null;
  })();

  const educationDisplay = [
    educationalBackground.educationType,
    educationalBackground.universityName,
    educationalBackground.facultyName,
    graduationDisplay,
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

        <DeleteDialogFooter
          onCancel={onClose}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      </div>
    </Dialog>
  );
};
