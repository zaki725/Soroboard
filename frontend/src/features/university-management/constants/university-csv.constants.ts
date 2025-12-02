import type { CsvHeader } from '@/libs/csv-utils';

export const universityExportCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '大学名', label: '大学名' },
  { key: '学校ランク', label: '学校ランク' },
];

export const universityCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: '大学名', label: '大学名' },
  { key: '学校ランク', label: '学校ランク' },
];

export const universityEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '大学名', label: '大学名' },
  { key: '学校ランク', label: '学校ランク' },
];
