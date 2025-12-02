import type { ExcelHeader } from '@/libs/excel-utils';

export const eventCreateTemplateExcelHeaders = (
  eventMasterIds: string[],
  eventLocationIds: string[],
): ExcelHeader[] => [
  {
    key: 'イベントマスターID',
    label: 'イベントマスターID',
    validation: {
      type: 'list',
      values: eventMasterIds.length > 0 ? eventMasterIds : [''],
    },
  },
  {
    key: 'ロケーションID',
    label: 'ロケーションID',
    validation: {
      type: 'list',
      values: eventLocationIds.length > 0 ? eventLocationIds : [''],
    },
  },
  { key: '開始時刻', label: '開始時刻' },
  { key: '終了時刻', label: '終了時刻' },
  { key: '備考', label: '備考' },
  { key: '開催場所', label: '開催場所' },
  { key: '面接官ID（カンマ区切り）', label: '面接官ID（カンマ区切り）' },
];

export const eventEditTemplateExcelHeaders = (
  eventMasterIds: string[],
  eventLocationIds: string[],
): ExcelHeader[] => [
  { key: 'ID', label: 'ID' },
  {
    key: 'イベントマスターID',
    label: 'イベントマスターID',
    validation: {
      type: 'list',
      values: eventMasterIds.length > 0 ? eventMasterIds : [''],
    },
  },
  {
    key: 'ロケーションID',
    label: 'ロケーションID',
    validation: {
      type: 'list',
      values: eventLocationIds.length > 0 ? eventLocationIds : [''],
    },
  },
  { key: '開始時刻', label: '開始時刻' },
  { key: '終了時刻', label: '終了時刻' },
  { key: '備考', label: '備考' },
  { key: '開催場所', label: '開催場所' },
  { key: '面接官ID（カンマ区切り）', label: '面接官ID（カンマ区切り）' },
];
