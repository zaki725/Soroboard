import type { CsvHeader } from '@/libs/csv-utils';

export const eventMasterExportCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'イベント名', label: 'イベント名' },
  { key: '説明', label: '説明' },
  { key: 'タイプ', label: 'タイプ' },
];

export const eventMasterCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: 'イベント名', label: 'イベント名' },
  { key: '説明', label: '説明' },
  { key: 'タイプ', label: 'タイプ' },
];

export const eventMasterEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'イベント名', label: 'イベント名' },
  { key: '説明', label: '説明' },
  { key: 'タイプ', label: 'タイプ' },
];
