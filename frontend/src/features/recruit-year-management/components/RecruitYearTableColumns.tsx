import { Button } from '@/components/ui';
import type { RecruitYearResponseDto } from '@/types/recruit-year';

type ColumnProps = {
  startEdit: (year: RecruitYearResponseDto) => void;
};

export const getTableColumns = ({ startEdit }: ColumnProps) => {
  return [
    { key: 'recruitYear', label: '年度' },
    { key: 'displayName', label: '表示名' },
    {
      key: 'themeColor',
      label: 'テーマカラー',
      render: (_value: unknown, row: RecruitYearResponseDto) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: row.themeColor }}
          />
          <span className="text-sm">{row.themeColor}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: RecruitYearResponseDto) => (
        <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
          編集
        </Button>
      ),
    },
  ];
};
