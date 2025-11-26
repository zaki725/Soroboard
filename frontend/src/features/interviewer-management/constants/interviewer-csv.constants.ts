import type { CsvHeader } from '@/libs/csv-utils';
import type { ExcelHeader } from '@/libs/excel-utils';
import { INTERVIEWER_CATEGORIES } from '@/constants/enums';

// カテゴリの選択肢（プルダウン用）
const categoryValidationValues = INTERVIEWER_CATEGORIES;

export const interviewerCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'カテゴリ', label: 'カテゴリ' },
];

export const interviewerCreateTemplateExcelHeaders = (): ExcelHeader[] => [
  {
    key: 'ID',
    label: 'ID',
  },
  {
    key: 'カテゴリ',
    label: 'カテゴリ',
    validation: {
      type: 'list',
      values: categoryValidationValues,
    },
  },
];

export const interviewerEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'カテゴリ', label: 'カテゴリ' },
];

export const interviewerEditTemplateExcelHeaders = (): ExcelHeader[] => [
  {
    key: 'ID',
    label: 'ID',
  },
  {
    key: 'カテゴリ',
    label: 'カテゴリ',
    validation: {
      type: 'list',
      values: categoryValidationValues,
    },
  },
];
