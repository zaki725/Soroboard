'use client';

import {
  TextField,
  SelectField,
  FormError,
  FormFooter,
} from '@/components/form';

type EditCompanyFormContentProps = {
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  recruitYearOptions: Array<{ value: number; label: string }>;
};

export const EditCompanyFormContent = ({
  error,
  isSubmitting,
  onClose,
  recruitYearOptions,
}: EditCompanyFormContentProps) => {
  return (
    <div className="space-y-6">
      <TextField
        name="name"
        label="会社名"
        placeholder="会社名を入力"
        rules={{
          required: '会社名は必須です',
          minLength: {
            value: 1,
            message: '会社名は1文字以上で入力してください',
          },
        }}
      />

      <TextField
        name="phoneNumber"
        label="電話番号"
        placeholder="電話番号を入力（例: 03-1234-5678）"
        rules={{}}
      />

      <TextField
        name="email"
        label="メールアドレス"
        placeholder="メールアドレスを入力（例: example@company.com）"
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'メールアドレスの形式が正しくありません',
          },
        }}
      />

      <TextField
        name="websiteUrl"
        label="WEBサイトURL"
        placeholder="WEBサイトURLを入力（例: https://www.example.com）"
        rules={{
          pattern: {
            value: /^https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+$/,
            message: 'WEBサイトURLの形式が正しくありません',
          },
        }}
      />

      <SelectField
        name="recruitYearId"
        label="年度"
        options={recruitYearOptions}
        rules={{
          required: '年度は必須です',
          valueAsNumber: true,
        }}
        disabled
      />

      <FormError error={error} />

      <FormFooter
        onCancel={onClose}
        submitLabel="保存"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
