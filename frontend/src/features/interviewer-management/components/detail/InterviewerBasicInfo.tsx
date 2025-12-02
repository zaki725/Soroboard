'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, SaveIcon, CancelIcon } from '@/components/ui';
import { SelectField } from '@/components/form';
import type {
  InterviewerResponseDto,
  InterviewerCategory,
} from '@/types/interviewer';
import type { UseFormSetError } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { INTERVIEWER_CATEGORIES } from '@/constants/enums';

type InterviewerBasicInfoProps = {
  interviewer: InterviewerResponseDto;
  onUpdate: () => void;
};

type CategoryFormData = {
  category: InterviewerCategory;
};

const categoryOptions = INTERVIEWER_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

export const InterviewerBasicInfo = ({
  interviewer,
  onUpdate,
}: InterviewerBasicInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<CategoryFormData>({
    defaultValues: {
      category: interviewer.category,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<InterviewerResponseDto>('/interviewers', {
        method: 'PUT',
        body: {
          userId: interviewer.userId,
          category: data.category,
        },
      });
      setIsEditing(false);
      toast.success('カテゴリを更新しました');
      onUpdate();
    } catch (err) {
      handleFormError(
        err,
        methods.setError as UseFormSetError<CategoryFormData>,
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
    methods.reset({ category: interviewer.category });
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ユーザーID</p>
                <p className="font-medium">{interviewer.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">名前</p>
                <p className="font-medium">{interviewer.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">メールアドレス</p>
                <p className="font-medium">{interviewer.userEmail}</p>
              </div>
              <div>
                <SelectField
                  name="category"
                  label="カテゴリ"
                  rules={{
                    required: 'カテゴリは必須です',
                  }}
                  options={categoryOptions}
                  disabled={isSubmitting}
                />
              </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">ユーザーID</p>
            <p className="font-medium">{interviewer.userId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">名前</p>
            <p className="font-medium">{interviewer.userName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">メールアドレス</p>
            <p className="font-medium">{interviewer.userEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">カテゴリ</p>
            <p className="font-medium">{interviewer.category}</p>
          </div>
        </div>
      )}
    </div>
  );
};
