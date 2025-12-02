'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import { Loading, Button, CancelIcon, SaveIcon } from '@/components/ui';
import { TextField, SelectField, HelpTooltip } from '@/components/form';
import { roleOptions, genderOptions } from '../../constants/user.constants';
import { useDepartmentList } from '@/features/department-management/hooks/useDepartmentList';
import { useMemo } from 'react';
import type { UserResponseDto, UserRole, Gender } from '@/types/user';
import type { SelectOption } from '@/components/ui';

type UserFormData = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | '';
  departmentId: string;
};

type EditUserFormProps = {
  user: UserResponseDto;
  onSubmit: (
    data: UserFormData,
    setError: UseFormSetError<UserFormData>,
  ) => Promise<void>;
  onCancel: () => void;
  onSuccess: () => Promise<void>;
};

export const EditUserForm = ({
  user,
  onSubmit,
  onCancel,
  onSuccess,
}: EditUserFormProps) => {
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

  const methods = useForm<UserFormData>({
    defaultValues: {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender || '',
      departmentId: user.departmentId,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data, methods.setError);
      await onSuccess();
    } catch {
      // エラーはonSubmit内で処理済み
    }
  });

  if (isLoadingDepartments) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </div>
            <p className="text-sm text-gray-900">{user.id}</p>
          </div>
          <TextField
            name="email"
            label="メールアドレス"
            placeholder="メールアドレスを入力（例: user@example.com）"
            rules={{ required: 'メールアドレスは必須です' }}
          />
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
          <SelectField
            name="role"
            label="権限"
            options={roleOptions.filter((opt) => opt.value !== '')}
            rules={{ required: '権限は必須です' }}
          />
          <SelectField name="gender" label="性別" options={genderOptions} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="font-medium text-sm text-gray-700">部署</label>
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
            更新
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
