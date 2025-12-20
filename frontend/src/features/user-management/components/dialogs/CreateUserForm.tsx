'use client';

import { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Loading, Button, CancelIcon, SaveIcon } from '@/components/ui';
import {
  TextField,
  SelectField,
  FormError,
  HelpTooltip,
} from '@/components/form';
import { roleOptions, genderOptions } from '../../constants/user.constants';
// department-management機能は削除されたため、部署フィールドは無効化
import type { UserRole, Gender } from '@/types/user';
import type { SelectOption } from '@/components/ui';
import { useUserForm } from '../../hooks/useUserForm';

type UserFormData = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | '';
  departmentId: string;
};

type CreateUserFormProps = {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
};

export const CreateUserForm = ({ onSubmit, onCancel }: CreateUserFormProps) => {
  // department-management機能は削除されたため、部署フィールドは無効化
  const departments: Array<{ id: string; name: string }> = [];
  const isLoadingDepartments = false;
  const departmentError: string | null = null;
  const departmentOptions: SelectOption[] = [];

  const { isLoading, error, defaultValues, handleSubmit } = useUserForm({
    userId: undefined,
  });

  // department-management機能は削除されたため、デフォルト値はそのまま使用
  const adjustedDefaultValues = defaultValues;

  const methods = useForm<UserFormData>({
    defaultValues: adjustedDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmitForm = methods.handleSubmit(async (data) => {
    try {
      await handleSubmit(data, methods.setError);
      await onSubmit();
    } catch {
      // エラーはhandleSubmit内で処理済み
    }
  });

  if (isLoading || isLoadingDepartments) {
    return <Loading />;
  }

  return (
    <div>
      <FormError error={error} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmitForm} noValidate className="space-y-6">
          <div className="space-y-4">
            <TextField
              name="email"
              label="メールアドレス"
              placeholder="メールアドレスを入力（例: user@example.com）"
              rules={{ required: 'メールアドレスは必須です' }}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="lastName"
                label="姓"
                placeholder="姓を入力"
                rules={{ required: '姓は必須です' }}
              />
              <TextField
                name="firstName"
                label="名"
                placeholder="名を入力"
                rules={{ required: '名は必須です' }}
              />
            </div>
            <SelectField
              name="role"
              label="権限"
              options={roleOptions.filter((opt) => opt.value !== '')}
              rules={{ required: '権限は必須です' }}
            />
            <SelectField name="gender" label="性別" options={genderOptions} />
            {/* department-management機能は削除されたため、部署フィールドは非表示 */}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              icon={<CancelIcon />}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" icon={<SaveIcon />}>
              登録
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
