'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, SaveIcon, CancelIcon } from '@/components/ui';
import { MultiSelectField, HelpTooltip } from '@/components/form';
import type { EventResponseDto } from '@/types/event';
import type { EventFormData } from '@/types/event';
import type { SelectOption } from '@/components/ui';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import type { UseFormSetError } from 'react-hook-form';

type EventInterviewersProps = {
  event: EventResponseDto;
  interviewerOptions: SelectOption[];
  onUpdate: () => void;
};

export const EventInterviewers = ({
  event,
  interviewerOptions,
  onUpdate,
}: EventInterviewersProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedInterviewers = event.interviewerIds
    ? interviewerOptions.filter((opt) =>
        event.interviewerIds?.includes(opt.value as string),
      )
    : [];

  const methods = useForm<Pick<EventFormData, 'interviewerIds'>>({
    defaultValues: {
      interviewerIds: event.interviewerIds || [],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 既存のイベント情報をそのまま使用（面接官のみ更新）
      await apiClient<EventResponseDto>('/events', {
        method: 'PUT',
        body: {
          id: event.id,
          startTime: event.startTime,
          endTime: event.endTime || null,
          notes: event.notes || null,
          locationId: event.locationId,
          address: event.address || null,
          interviewerIds: data.interviewerIds || [],
        },
      });

      setIsEditing(false);
      toast.success('面接官を更新しました');
      onUpdate();
    } catch (err) {
      handleFormError(
        err,
        methods.setError as UseFormSetError<
          Pick<EventFormData, 'interviewerIds'>
        >,
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
      interviewerIds: event.interviewerIds || [],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">担当面接官</h2>
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
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="font-medium text-sm text-gray-700">
                  面接官
                </label>
                <HelpTooltip
                  message="面接官がプルダウンにない場合は"
                  linkText="面接官管理"
                  linkHref="/admin/interviewer-management"
                />
              </div>
              <MultiSelectField
                name="interviewerIds"
                options={interviewerOptions}
              />
            </div>
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
        <>
          {selectedInterviewers.length > 0 ? (
            <ul className="space-y-2">
              {selectedInterviewers.map((interviewer) => (
                <li key={interviewer.value} className="text-sm">
                  <p className="font-medium">{interviewer.label}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">面接官が登録されていません</p>
          )}
        </>
      )}
    </div>
  );
};
