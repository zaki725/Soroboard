'use client';

import { Button, CancelIcon } from '@/components/ui';
import { SelectField, FormError, HelpTooltip } from '@/components/form';
import { useMemo } from 'react';
import type { SelectOption } from '@/components/ui';
import type { UserResponseDto } from '@/types/user';

type CreateInterviewerFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  users: UserResponseDto[];
};

export const CreateInterviewerFormContent = ({
  error,
  isSubmitting,
  onClose,
  users,
}: CreateInterviewerFormContentProps) => {
  // 面接官ではないユーザーのリスト
  const nonInterviewerUsers = useMemo(() => {
    return users.filter((user) => !user.isInterviewer);
  }, [users]);

  // ユーザーオプション（面接官ではないユーザーのみ）
  const userOptions: SelectOption[] = useMemo(() => {
    return nonInterviewerUsers.map((user) => {
      const name = `${user.lastName} ${user.firstName}`;
      const department = ` - ${user.departmentName}`;
      return {
        value: user.id,
        label: `${name} (${user.email}${department})`,
      };
    });
  }, [nonInterviewerUsers]);

  // カテゴリオプション
  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { value: 'フロント', label: 'フロント' },
      { value: '現場社員', label: '現場社員' },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm text-gray-700">ユーザー</label>
          <HelpTooltip
            message="プルダウンにない場合は"
            linkText="マスター権限者でユーザー登録"
            linkHref="/master/user-management"
          />
        </div>
        <SelectField
          name="userId"
          rules={{
            required: 'ユーザーは必須です',
          }}
          options={userOptions}
          disabled={isSubmitting || userOptions.length === 0}
        />
      </div>

      <SelectField
        name="category"
        label="カテゴリ"
        rules={{
          required: 'カテゴリは必須です',
        }}
        options={categoryOptions}
        disabled={isSubmitting}
      />

      {userOptions.length === 0 && (
        <p className="text-sm text-gray-500">
          面接官として登録されていないユーザーがありません。
        </p>
      )}

      <FormError error={error} />

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            <CancelIcon />
            <span>キャンセル</span>
          </div>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || userOptions.length === 0}
        >
          {isSubmitting ? '登録中...' : '登録'}
        </Button>
      </div>
    </div>
  );
};
