'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, SearchIcon, ResetIcon } from '@/components/ui';
import { TextField } from '@/components/form';

type CompanySearchFormData = {
  id: string;
  search: string;
};

type CompanySearchFormProps = {
  onSearch: (data: CompanySearchFormData) => void;
  onReset: () => void;
  searchParams: CompanySearchFormData;
};

export const CompanySearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: CompanySearchFormProps) => {
  const methods = useForm<CompanySearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({ id: '', search: '' });
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
                placeholder="会社名、メールアドレス、電話番号、WEBサイトURLで検索"
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
