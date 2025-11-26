'use client';

import { TextField, SelectField, TextareaField } from '@/components/form';
import { LOCATION_TYPES } from '@/constants/enums';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export const CreateEventMasterFormContent = () => {
  const { selectedRecruitYear } = useRecruitYear();
  const typeOptions = LOCATION_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const recruitYearOptions = selectedRecruitYear
    ? [
        {
          value: selectedRecruitYear.recruitYear,
          label: `${selectedRecruitYear.recruitYear}年度`,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      <TextField
        name="name"
        label="イベント名"
        placeholder="イベント名を入力"
        rules={{
          required: 'イベント名は必須です',
          minLength: {
            value: 1,
            message: 'イベント名は1文字以上で入力してください',
          },
        }}
      />
      <TextareaField
        name="description"
        label="説明"
        placeholder="説明を入力してください（任意）"
        rows={4}
      />
      <SelectField
        name="type"
        label="タイプ"
        options={typeOptions}
        rules={{
          required: 'タイプは必須です',
        }}
      />
      <SelectField
        name="recruitYearId"
        label="対象年度"
        options={recruitYearOptions}
        rules={{
          required: '対象年度は必須です',
          valueAsNumber: true,
        }}
        disabled
      />
    </div>
  );
};
