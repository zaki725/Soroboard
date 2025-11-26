import type { ExcelHeader } from '@/libs/excel-utils';
import { roleLabelMap, genderLabelMap } from './user.constants';

// 権限の選択肢（プルダウン用）
const roleValidationValues = Object.values(roleLabelMap);
// 性別の選択肢（プルダウン用）
const genderValidationValues = Object.values(genderLabelMap);

export const userCreateTemplateExcelHeaders = (
  departmentNames: string[],
): ExcelHeader[] => [
  { key: 'メールアドレス', label: 'メールアドレス' },
  { key: '姓', label: '姓' },
  { key: '名', label: '名' },
  {
    key: '権限',
    label: '権限',
    validation: {
      type: 'list',
      values: roleValidationValues,
    },
  },
  {
    key: '性別',
    label: '性別',
    validation: {
      type: 'list',
      values: genderValidationValues,
    },
  },
  {
    key: '部署',
    label: '部署',
    validation: {
      type: 'list',
      values: departmentNames.length > 0 ? departmentNames : [''],
    },
  },
];

export const userEditTemplateExcelHeaders = (
  departmentNames: string[],
): ExcelHeader[] => [
  { key: 'ID', label: 'ID' },
  { key: 'メールアドレス', label: 'メールアドレス' },
  { key: '姓', label: '姓' },
  { key: '名', label: '名' },
  {
    key: '権限',
    label: '権限',
    validation: {
      type: 'list',
      values: roleValidationValues,
    },
  },
  {
    key: '性別',
    label: '性別',
    validation: {
      type: 'list',
      values: genderValidationValues,
    },
  },
  {
    key: '部署',
    label: '部署',
    validation: {
      type: 'list',
      values: departmentNames.length > 0 ? departmentNames : [''],
    },
  },
];
