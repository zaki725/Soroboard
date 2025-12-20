'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Title,
  PageContainer,
  Button,
  Loading,
  CancelIcon,
  SaveIcon,
} from '@/components/ui';
import {
  TextField,
  SelectField,
  FormError,
  HelpTooltip,
} from '@/components/form';
import { roleOptions, genderOptions } from '../../constants/user.constants';
import { useUserForm } from '../../hooks/useUserForm';
// department-management機能は削除されたため、部署フィールドは無効化
import type { UserRole, Gender } from '@/types/user';
import type { SelectOption } from '@/components/ui';

type UserFormData = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | '';
  departmentId: string;
};

export const UserForm = () => {
  const params = useParams();
  const userId = params?.id as string | undefined;
  // department-management機能は削除されたため、部署フィールドは無効化
  const departments: Array<{ id: string; name: string }> = [];
  const isLoadingDepartments = false;
  const departmentError: string | null = null;
  const departmentOptions: SelectOption[] = [];

  const {
    isLoading,
    error,
    isEdit,
    defaultValues,
    handleSubmit,
    handleCancel,
  } = useUserForm({ userId });

  const formKey = useMemo(
    () => (isEdit ? `edit-${userId}` : 'new'),
    [isEdit, userId],
  );

  // department-management機能は削除されたため、デフォルト値はそのまま使用
  const adjustedDefaultValues = defaultValues;

  const methods = useForm<UserFormData>({
    defaultValues: adjustedDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = methods.handleSubmit((data) => {
    void handleSubmit(data, methods.setError);
  });

  if (isLoading || isLoadingDepartments) {
    return (
      <PageContainer>
        <Title>{isEdit ? 'ユーザー編集' : 'ユーザー新規登録'}</Title>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>{isEdit ? 'ユーザー編集' : 'ユーザー新規登録'}</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <FormError error={error} />

        <div key={formKey}>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} noValidate className="space-y-6">
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
                <SelectField
                  name="gender"
                  label="性別"
                  options={genderOptions}
                />
                {/* department-management機能は削除されたため、部署フィールドは非表示 */}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  icon={<CancelIcon />}
                >
                  キャンセル
                </Button>
                <Button type="submit" variant="primary" icon={<SaveIcon />}>
                  {isEdit ? '更新' : '登録'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </PageContainer>
  );
};
