import type { CsvHeader } from '@/libs/csv-utils';

export const eventExportCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'イベントマスター名', label: 'イベントマスター名' },
  { key: 'ロケーション名', label: 'ロケーション名' },
  { key: '開始時刻', label: '開始時刻' },
  { key: '終了時刻', label: '終了時刻' },
  { key: '備考', label: '備考' },
  { key: '開催場所', label: '開催場所' },
  { key: '面接官名', label: '面接官名' },
];

export const eventCreateTemplateCsvHeaders: CsvHeader[] = [
  { key: 'イベントマスターID', label: 'イベントマスターID' },
  { key: 'ロケーションID', label: 'ロケーションID' },
  { key: '開始時刻', label: '開始時刻' },
  { key: '終了時刻', label: '終了時刻' },
  { key: '備考', label: '備考' },
  { key: '開催場所', label: '開催場所' },
  { key: '面接官ID（カンマ区切り）', label: '面接官ID（カンマ区切り）' },
];

export const eventEditTemplateCsvHeaders: CsvHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: 'イベントマスターID', label: 'イベントマスターID' },
  { key: 'ロケーションID', label: 'ロケーションID' },
  { key: '開始時刻', label: '開始時刻' },
  { key: '終了時刻', label: '終了時刻' },
  { key: '備考', label: '備考' },
  { key: '開催場所', label: '開催場所' },
  { key: '面接官ID（カンマ区切り）', label: '面接官ID（カンマ区切り）' },
];
