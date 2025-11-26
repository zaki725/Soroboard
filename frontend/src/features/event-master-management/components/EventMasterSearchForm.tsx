'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui';
import { TextField, SelectField } from '@/components/form';
import { SearchIcon, ResetIcon } from '@/components/ui/icons';
import type { EventMasterSearchFormData } from '../hooks/useEventMasterList';
import { LOCATION_TYPES } from '@/constants/enums';

type EventMasterSearchFormProps = {
  defaultValues: EventMasterSearchFormData;
  onSubmit: (data: EventMasterSearchFormData) => void;
  onReset: () => void;
};

export const EventMasterSearchForm = ({
  defaultValues,
  onSubmit,
  onReset,
}: EventMasterSearchFormProps) => {
  const methods = useForm<EventMasterSearchFormData>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  const typeOptions = [
    { value: '', label: 'すべて' },
    ...LOCATION_TYPES.map((type) => ({
      value: type,
      label: type,
    })),
  ];

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
              placeholder="イベント名で検索"
            />
          </div>
          <div className="w-40">
            <SelectField name="type" label="タイプ" options={typeOptions} />
          </div>
          <Button type="submit" icon={<SearchIcon />}>
            検索
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            icon={<ResetIcon />}
          >
            リセット
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
