import type { UserRole, Gender } from '@/constants/enums';
import type { SelectOption } from '@/components/ui';

export const roleOptions: SelectOption[] = [
  { value: '', label: 'すべて' },
  { value: 'TEACHER', label: '先生' },
  { value: 'ADMIN', label: '管理者' },
];

export const genderOptions: SelectOption[] = [
  { value: '', label: 'すべて' },
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
];

export const roleLabelMap: Record<UserRole, string> = {
  TEACHER: '先生',
  ADMIN: '管理者',
};

export const genderLabelMap: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
};
