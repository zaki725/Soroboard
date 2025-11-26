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
import { roleOptions, genderOptions } from '../constants/user.constants';
import { useUserForm } from '../hooks/useUserForm';
import { useDepartmentList } from '@/features/department-management/hooks/useDepartmentList';
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
  const {
    departments,
    isLoading: isLoadingDepartments,
    error: departmentError,
  } = useDepartmentList();
  const departmentOptions: SelectOption[] = useMemo(() => {
    return departments.map((dept) => ({
      value: dept.id,
      label: dept.name,
    }));
  }, [departments]);

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

  // システム本部のIDを取得
  const systemDeptId = useMemo(() => {
    const dept = departments.find((d) => d.name === 'システム本部');
    return dept?.id || '';
  }, [departments]);

  // 新規作成時のデフォルト値を修正（システム本部を設定）
  const adjustedDefaultValues = useMemo(() => {
    if (!isEdit && defaultValues.departmentId === '') {
      return {
        ...defaultValues,
        departmentId: systemDeptId,
      };
    }
    return defaultValues;
  }, [defaultValues, systemDeptId, isEdit]);

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
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="font-medium text-sm text-gray-700">
                      部署
                    </label>
                    <HelpTooltip
                      message="部署がプルダウンにない場合は"
                      linkText="登録"
                      linkHref="/master/department-management"
                    />
                  </div>
                  <SelectField
                    name="departmentId"
                    options={departmentOptions}
                    rules={{ required: '部署は必須です' }}
                    disabled={
                      isLoadingDepartments ||
                      !!departmentError ||
                      departmentOptions.length === 0
                    }
                  />
                </div>
                {departmentError && (
                  <p className="text-sm text-red-600 mt-1">
                    部署データの取得に失敗しました: {departmentError}
                  </p>
                )}
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
