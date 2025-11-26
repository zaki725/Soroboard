import type { CsvHeader } from '@/libs/csv-utils';

export const companyExportCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '会社名', label: '会社名' },
  { key: '電話番号', label: '電話番号' },
  { key: 'メールアドレス', label: 'メールアドレス' },
  { key: 'WEBサイトURL', label: 'WEBサイトURL' },
];

export const companyCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: '会社名', label: '会社名' },
  { key: '電話番号', label: '電話番号' },
  { key: 'メールアドレス', label: 'メールアドレス' },
  { key: 'WEBサイトURL', label: 'WEBサイトURL' },
];

export const companyEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '会社名', label: '会社名' },
  { key: '電話番号', label: '電話番号' },
  { key: 'メールアドレス', label: 'メールアドレス' },
  { key: 'WEBサイトURL', label: 'WEBサイトURL' },
];
