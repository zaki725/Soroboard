'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, SearchIcon, ResetIcon } from '@/components/ui';
import { TextField, SelectField } from '@/components/form';
import type { InterviewerCategory } from '@/types/interviewer';
import { INTERVIEWER_CATEGORIES } from '@/constants/enums';

type InterviewerSearchFormData = {
  userId: string;
  search: string;
  category: InterviewerCategory | '';
};

type InterviewerSearchFormProps = {
  onSearch: (data: InterviewerSearchFormData) => void;
  onReset: () => void;
  searchParams: InterviewerSearchFormData;
};

const categoryOptions: Array<{
  value: InterviewerCategory | '';
  label: string;
}> = [
  { value: '', label: 'すべて' },
  ...INTERVIEWER_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
];

export const InterviewerSearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: InterviewerSearchFormProps) => {
  const methods = useForm<InterviewerSearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({ userId: '', search: '', category: '' });
    onReset();
  };

  return (
    <div key={JSON.stringify(searchParams)}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="w-full md:w-80">
              <TextField
                name="userId"
                label="ユーザーID"
                placeholder="ユーザーID（カンマ/スペース区切り可）"
              />
            </div>
            <div className="w-80">
              <TextField
                name="search"
                label="検索"
                placeholder="ユーザーID、名前、メールアドレスで検索"
              />
            </div>
            <div className="w-40">
              <SelectField
                name="category"
                label="カテゴリ"
                options={categoryOptions}
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
    </div>
  );
};
