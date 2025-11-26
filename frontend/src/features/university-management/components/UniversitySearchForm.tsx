'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, SearchIcon, ResetIcon } from '@/components/ui';
import { TextField, SelectField } from '@/components/form';
import { UniversityRankLevel } from '@/types/university';

type UniversitySearchFormData = {
  id: string;
  search: string;
  rank: UniversityRankLevel | '';
};

const rankOptions = [
  { value: '', label: 'すべて' },
  { value: 'S', label: 'S' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

type UniversitySearchFormProps = {
  onSearch: (data: UniversitySearchFormData) => void;
  onReset: () => void;
  searchParams: UniversitySearchFormData;
};

export const UniversitySearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: UniversitySearchFormProps) => {
  const methods = useForm<UniversitySearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({ id: '', search: '', rank: '' });
    onReset();
  };

  return (
    <div key={JSON.stringify(searchParams)}>
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
                placeholder="大学名で検索"
              />
            </div>
            <div className="w-40">
              <SelectField
                name="rank"
                label="学校ランク"
                options={rankOptions}
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
