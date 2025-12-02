import type { CsvHeader } from '@/libs/csv-utils';

export const eventLocationExportCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'ロケーション名', label: 'ロケーション名' },
];

export const eventLocationCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ロケーション名', label: 'ロケーション名' },
];

export const eventLocationEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'ロケーション名', label: 'ロケーション名' },
];
