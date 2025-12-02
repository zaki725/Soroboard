'use client';

import { Dialog, Button } from '@/components/ui';
import type { InterviewerResponseDto } from '@/types/interviewer';

type DeleteInterviewerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  interviewer: InterviewerResponseDto | null;
  isSubmitting: boolean;
};

export const DeleteInterviewerDialog = ({
  isOpen,
  onClose,
  onConfirm,
  interviewer,
  isSubmitting,
}: DeleteInterviewerDialogProps) => {
  if (!interviewer) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // エラーはonConfirm側で処理されることを想定
      // エラーログを出力してデバッグを容易にする
      console.error('Error in delete confirmation:', error);
      // エラーハンドリングはonConfirm内で実施
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="面接官削除"
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
          以下の面接官を削除しますか？この操作は取り消せません。
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">
            名前: {interviewer.userName}
          </p>
          <p className="text-sm text-gray-600">
            メールアドレス: {interviewer.userEmail}
          </p>
          <p className="text-sm text-gray-600">
            カテゴリ: {interviewer.category}
          </p>
        </div>
      </div>
    </Dialog>
  );
};
