'use client';

import { Button, SearchIcon, ResetIcon } from '@/components/ui';
import { TextField, SelectField } from '@/components/form';
import { useForm, FormProvider } from 'react-hook-form';

type ApplicantSearchFormData = {
  search: string;
  status: string;
  university: string;
};

type ApplicantSearchFormProps = {
  onSearch: (data: ApplicantSearchFormData) => void;
  onReset: () => void;
  searchParams: ApplicantSearchFormData;
};

const statusOptions = [
  { value: '', label: 'すべて' },
  { value: 'applied', label: '応募済み' },
  { value: 'screening', label: '選考中' },
  { value: 'interview', label: '面接中' },
  { value: 'offer', label: '内定' },
  { value: 'rejected', label: '不採用' },
];

const universityOptions = [
  { value: '', label: 'すべて' },
  { value: 'tokyo', label: '東京大学' },
  { value: 'kyoto', label: '京都大学' },
  { value: 'waseda', label: '早稲田大学' },
  { value: 'keio', label: '慶應義塾大学' },
];

export const ApplicantSearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: ApplicantSearchFormProps) => {
  const methods = useForm<ApplicantSearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({ search: '', status: '', university: '' });
    onReset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="w-full md:w-80">
            <TextField
              name="search"
              label="検索"
              placeholder="名前、メールアドレスで検索"
            />
          </div>
          <div className="w-40">
            <SelectField
              name="status"
              label="ステータス"
              options={statusOptions}
            />
          </div>
          <div className="w-40">
            <SelectField
              name="university"
              label="大学"
              options={universityOptions}
            />
          </div>
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
