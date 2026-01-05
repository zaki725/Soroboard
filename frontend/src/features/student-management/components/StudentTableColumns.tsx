import type { TableColumn } from '@/components/ui';
import type { StudentResponseDto } from '@/types/student';
import { statusLabelMap } from '../constants/student.constants';

export const getTableColumns = (): TableColumn<StudentResponseDto>[] => {
  return [
    { key: 'studentNo', label: '生徒番号',},
    { key: 'firstName', label: '姓' },
    { key: 'lastName', label: '名' },
    {
      key: 'birthDate',
      label: '誕生日',
      render: (_value: unknown, row: StudentResponseDto) => {
        const birthDate = row.birthDate;
        if (!birthDate) return '-';
        const date = new Date(birthDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      },
    },
    {
      key: 'status',
      label: 'ステータス',
      render: (_value: unknown, row: StudentResponseDto) => {
        const status = row.status;
        return statusLabelMap[status] || status;
      },
    },
    {
      key: 'joinedAt',
      label: '入塾日',
      render: (_value: unknown, row: StudentResponseDto) => {
        const joinedAt = row.joinedAt;
        if (!joinedAt) return '-';
        const date = new Date(joinedAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      },
    },
    {
      key: 'leftAt',
      label: '退塾日',
      render: (_value: unknown, row: StudentResponseDto) => {
        const leftAt = row.leftAt;
        if (!leftAt) return '-';
        const date = new Date(leftAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      },
    },
  ];
};
