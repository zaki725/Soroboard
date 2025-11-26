import type { ExcelHeader } from '@/libs/excel-utils';

export const eventLocationCreateTemplateExcelHeaders = (): ExcelHeader[] => [
  { key: 'ロケーション名', label: 'ロケーション名' },
];

export const eventLocationEditTemplateExcelHeaders = (): ExcelHeader[] => [
  { key: 'ID', label: 'ID' },
  { key: 'ロケーション名', label: 'ロケーション名' },
];
