import type { TableColumn } from '@/components/ui';
import type { TeacherResponseDto, TeacherRole } from '@/types/teacher';

const roleLabelMap: Record<TeacherRole, string> = {
  OWNER: '塾長',
  STAFF: 'スタッフ',
};

export const getTableColumns = (): TableColumn<TeacherResponseDto>[] => {
  return [
    { key: 'email', label: 'メールアドレス' },
    {
      key: 'roleInSchool',
      label: '役割',
      render: (_value: unknown, row: TeacherResponseDto) => {
        const role = row.roleInSchool;
        return roleLabelMap[role] || role;
      },
    },
    { key: 'lastName', label: '姓' },
    { key: 'firstName', label: '名' },
    {
      key: 'hourlyRate',
      label: '時給',
      render: (_value: unknown, row: TeacherResponseDto) => {
        const rate = row.hourlyRate;
        return rate !== null ? `¥${rate.toLocaleString()}` : '-';
      },
    },
    {
      key: 'isActive',
      label: '在籍状況',
      render: (_value: unknown, row: TeacherResponseDto) => {
        const isActive = row.isActive;
        return isActive ? '在籍中' : '休業中';
      },
    },
    {
      key: 'memo',
      label: 'メモ',
      render: (_value: unknown, row: TeacherResponseDto) => {
        const memo = row.memo;
        return memo || '-';
      },
    },
  ];
};
