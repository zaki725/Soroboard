'use client';

import {
  TextField,
  DateTimeField,
  SelectField,
  TextareaField,
  HelpTooltip,
} from '@/components/form';
import { useEventLocationOptions } from '../../hooks/useEventLocationOptions';
import type { EventResponseDto } from '@/types/event';

type EventBasicInfoFormContentProps = {
  event: EventResponseDto;
};

export const EventBasicInfoFormContent = ({
  event,
}: EventBasicInfoFormContentProps) => {
  const { eventLocationOptions } = useEventLocationOptions();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600">
        <p>イベントマスター: {event.eventMasterName}</p>
      </div>
      <DateTimeField
        name="startTime"
        label="開始日時"
        placeholder="開始日時を選択"
        rules={{
          required: '開始日時は必須です',
        }}
      />
      <DateTimeField
        name="endTime"
        label="終了日時"
        placeholder="終了日時（任意）"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm text-gray-700">
            ロケーション
          </label>
          <HelpTooltip
            message="ロケーションがプルダウンにない場合は"
            linkText="ロケーション管理"
            linkHref="/admin/event-location-management"
          />
        </div>
        <SelectField
          name="locationId"
          options={eventLocationOptions}
          rules={{
            required: 'ロケーションは必須です',
          }}
        />
      </div>
      <TextField
        name="address"
        label="開催場所"
        placeholder="開催場所を入力してください（任意）"
      />
      <TextareaField
        name="notes"
        label="備考"
        placeholder="備考を入力してください（任意）"
      />
    </div>
  );
};
