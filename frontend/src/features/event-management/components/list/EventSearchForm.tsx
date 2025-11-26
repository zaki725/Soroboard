'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button, SearchIcon, ResetIcon, Loading } from '@/components/ui';
import { TextField, SelectField, DateTimeField } from '@/components/form';
import type { EventSearchFormData } from '../../hooks/list/useEventList';
import { useEventMasterOptions } from '../../hooks/useEventMasterOptions';
import { useEventLocationOptions } from '../../hooks/useEventLocationOptions';
import { useInterviewerOptions } from '../../hooks/useInterviewerOptions';

type EventSearchFormProps = {
  onSearch: (data: EventSearchFormData) => void;
  onReset: () => void;
  searchParams: EventSearchFormData;
};

export const EventSearchForm = ({
  onSearch,
  onReset,
  searchParams,
}: EventSearchFormProps) => {
  const methods = useForm<EventSearchFormData>({
    defaultValues: searchParams,
    mode: 'onBlur',
  });

  const { eventMasterOptions, isLoading: isLoadingEventMasterOptions } =
    useEventMasterOptions();
  const { eventLocationOptions, isLoading: isLoadingEventLocationOptions } =
    useEventLocationOptions();
  const { interviewerOptions, isLoading: isLoadingInterviewerOptions } =
    useInterviewerOptions();

  if (
    isLoadingEventMasterOptions ||
    isLoadingEventLocationOptions ||
    isLoadingInterviewerOptions
  ) {
    return <Loading />;
  }

  const handleSubmit = methods.handleSubmit((data) => {
    onSearch(data);
  });

  const handleReset = () => {
    methods.reset({
      id: '',
      search: '',
      eventMasterId: '',
      locationId: '',
      interviewerId: '',
      startTimeFrom: '',
    });
    onReset();
  };

  const eventMasterSelectOptions = [
    { value: '', label: 'すべて' },
    ...eventMasterOptions,
  ];

  const eventLocationSelectOptions = [
    { value: '', label: 'すべて' },
    ...eventLocationOptions,
  ];

  const interviewerSelectOptions = [
    { value: '', label: 'すべて' },
    ...interviewerOptions,
  ];

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
                placeholder="イベント名、ロケーション名、備考で検索"
              />
            </div>
            <div className="w-80">
              <SelectField
                name="eventMasterId"
                label="イベントマスター"
                options={eventMasterSelectOptions}
              />
            </div>
            <div className="w-80">
              <SelectField
                name="locationId"
                label="ロケーション"
                options={eventLocationSelectOptions}
              />
            </div>
            <div className="w-80">
              <SelectField
                name="interviewerId"
                label="面接官"
                options={interviewerSelectOptions}
              />
            </div>
            <div className="w-80">
              <DateTimeField
                name="startTimeFrom"
                label="開始時刻"
                placeholder="開始時刻"
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
