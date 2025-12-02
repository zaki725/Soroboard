import type { ExcelHeader } from '@/libs/excel-utils';
import { LOCATION_TYPES } from '@/constants/enums';

export const eventMasterCreateTemplateExcelHeaders = (): ExcelHeader[] => [
  { key: 'イベント名', label: 'イベント名' },
  { key: '説明', label: '説明' },
  {
    key: 'タイプ',
    label: 'タイプ',
    validation: {
      type: 'list',
      values: LOCATION_TYPES,
    },
  },
];

export const eventMasterEditTemplateExcelHeaders = (): ExcelHeader[] => [
  { key: 'ID', label: 'ID' },
  { key: 'イベント名', label: 'イベント名' },
  { key: '説明', label: '説明' },
  {
    key: 'タイプ',
    label: 'タイプ',
    validation: {
      type: 'list',
      values: LOCATION_TYPES,
    },
  },
];
