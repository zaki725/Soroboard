import { Button, TrashIcon, EditIcon } from '@/components/ui';
import type { DepartmentResponseDto } from '@/types/department';

type ColumnProps = {
  startEdit: (department: DepartmentResponseDto) => void;
  startDelete: (department: DepartmentResponseDto) => void;
};

export const getTableColumns = ({ startEdit, startDelete }: ColumnProps) => {
  return [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '部署名' },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: DepartmentResponseDto) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEdit(row)}
            icon={<EditIcon />}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => startDelete(row)}
            icon={<TrashIcon />}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];
};
