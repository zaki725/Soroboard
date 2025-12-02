import { Button, EditIcon } from '@/components/ui';
import type { CompanyResponseDto } from '@/types/company';

type ColumnProps = {
  startEdit: (company: CompanyResponseDto) => void;
};

export const getTableColumns = ({ startEdit }: ColumnProps) => {
  return [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '会社名' },
    {
      key: 'phoneNumber',
      label: '電話番号',
      render: (_value: unknown, row: CompanyResponseDto) =>
        row.phoneNumber || '-',
    },
    {
      key: 'email',
      label: 'メールアドレス',
      render: (_value: unknown, row: CompanyResponseDto) => row.email || '-',
    },
    {
      key: 'websiteUrl',
      label: 'WEBサイトURL',
      render: (_value: unknown, row: CompanyResponseDto) =>
        row.websiteUrl ? (
          <a
            href={row.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {row.websiteUrl}
          </a>
        ) : (
          '-'
        ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: CompanyResponseDto) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => startEdit(row)}
          icon={<EditIcon />}
        >
          編集
        </Button>
      ),
    },
  ];
};
