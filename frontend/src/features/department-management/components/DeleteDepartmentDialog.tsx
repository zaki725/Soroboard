'use client';

import { Dialog } from '@/components/ui';
import { DeleteDialogFooter } from '@/components/form';
import type { DepartmentResponseDto } from '@/types/department';

type DeleteDepartmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  department: DepartmentResponseDto | null;
  isSubmitting: boolean;
};

export const DeleteDepartmentDialog = ({
  isOpen,
  onClose,
  onConfirm,
  department,
  isSubmitting,
}: DeleteDepartmentDialogProps) => {
  if (!department) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // エラーはonConfirm側で処理されることを想定
      // 必要に応じてここでもエラー表示を行う
      console.error('削除に失敗しました:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="部署削除"
      size="md"
      footer={
        <DeleteDialogFooter
          onCancel={onClose}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      }
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          以下の部署を削除しますか？この操作は取り消せません。
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">部署名: {department.name}</p>
        </div>
      </div>
    </Dialog>
  );
};
