'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, SaveIcon, CancelIcon } from '@/components/ui';
import {
  formatDateToJST,
  formatDateTimeToLocal,
  convertDateTimeLocalToISO,
} from '@/libs/date-utils';
import type { EventResponseDto } from '@/types/event';
import type { EventFormData } from '@/types/event';
import { EventBasicInfoFormContent } from './EventBasicInfoFormContent';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import type { UseFormSetError } from 'react-hook-form';

type EventBasicInfoProps = {
  event: EventResponseDto;
  onUpdate: () => void;
};

export const EventBasicInfo = ({ event, onUpdate }: EventBasicInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<EventFormData>({
    defaultValues: {
      startTime: formatDateTimeToLocal(event.startTime),
      endTime: event.endTime ? formatDateTimeToLocal(event.endTime) : '',
      notes: event.notes || '',
      eventMasterId: event.eventMasterId,
      locationId: event.locationId,
      address: event.address || '',
      interviewerIds: event.interviewerIds || [],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // startTimeとendTimeをISO形式のDateTime文字列に変換
      const startTimeISO = convertDateTimeLocalToISO(data.startTime);
      const endTimeISO = convertDateTimeLocalToISO(data.endTime);

      if (!startTimeISO) {
        throw new Error('開始日時は必須です');
      }

      await apiClient<EventResponseDto>('/events', {
        method: 'PUT',
        body: {
          id: event.id,
          startTime: startTimeISO,
          endTime: endTimeISO,
          notes: data.notes || null,
          locationId: data.locationId,
          address: data.address || null,
          interviewerIds: event.interviewerIds || [],
        },
      });

      setIsEditing(false);
      toast.success('基本情報を更新しました');
      onUpdate();
    } catch (err) {
      handleFormError(
        err,
        methods.setError as UseFormSetError<EventFormData>,
        setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    methods.reset({
      startTime: formatDateTimeToLocal(event.startTime),
      endTime: event.endTime ? formatDateTimeToLocal(event.endTime) : '',
      notes: event.notes || '',
      eventMasterId: event.eventMasterId,
      locationId: event.locationId,
      address: event.address || '',
      interviewerIds: event.interviewerIds || [],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">基本情報</h2>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            size="sm"
          >
            編集
          </Button>
        )}
      </div>
      {isEditing ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} noValidate>
            <EventBasicInfoFormContent event={event} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-4 justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-2">
                  <CancelIcon />
                  <span>キャンセル</span>
                </div>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <div className="flex items-center gap-2">
                  <SaveIcon />
                  <span>{isSubmitting ? '保存中...' : '保存'}</span>
                </div>
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID</p>
            <p className="font-medium">{event.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">イベント名</p>
            <p className="font-medium">{event.eventMasterName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">開始日時</p>
            <p className="font-medium">{formatDateToJST(event.startTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">終了日時</p>
            <p className="font-medium">
              {event.endTime ? formatDateToJST(event.endTime) : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">ロケーション</p>
            <p className="font-medium">{event.locationName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">開催場所</p>
            <p className="font-medium">{event.address || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">備考</p>
            <p className="font-medium whitespace-pre-wrap">
              {event.notes || '-'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
