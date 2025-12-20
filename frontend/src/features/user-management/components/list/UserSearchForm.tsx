'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, SearchIcon, ResetIcon, Loading } from '@/components/ui';
import { TextField, SelectField } from '@/components/form';
import { roleOptions, genderOptions } from '../../constants/user.constants';
// department-management機能は削除されたため、部署フィールドは無効化
import { useMemo } from 'react';
import type { UserRole, Gender } from '@/types/user';
import type { SelectOption } from '@/components/ui';

type UserSearchFormData = {
  id: string;
  search: string;
  role: UserRole | '';
  gender: Gender | '';
  departmentId: string;
};

type UserSearchFormProps = {
  onSearch: (data: UserSearchFormData) => void;
  onReset: () => void;
  searchParams: UserSearchFormData;
};

export const UserSearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: UserSearchFormProps) => {
  // department-management機能は削除されたため、部署フィールドは無効化
  const departments: Array<{ id: string; name: string }> = [];
  const isLoadingDepartments = false;
  const departmentOptions: SelectOption[] = [{ value: '', label: 'すべて' }];

  const methods = useForm<UserSearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  if (isLoadingDepartments) {
    return <Loading />;
  }

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({
      id: '',
      search: '',
      role: '',
      gender: '',
      departmentId: '',
    });
    onReset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="w-full md:w-80">
            <TextField
              name="id"
              label="ID"
              placeholder="ID（カンマ/スペース区切り可）"
            />
          </div>
          <div className="w-80">
            <TextField
              name="search"
              label="検索"
              placeholder="メールアドレス、名前で検索"
            />
          </div>
          <div className="w-40 z-10">
            <SelectField name="role" label="権限" options={roleOptions} />
          </div>
          <div className="w-40">
            <SelectField name="gender" label="性別" options={genderOptions} />
          </div>
          {/* department-management機能は削除されたため、部署フィールドは非表示 */}
          <Button type="submit" icon={<SearchIcon />}>
            検索
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            icon={<ResetIcon />}
          >
            リセット
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
