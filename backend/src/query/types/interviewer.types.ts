// 型定義は common/enums から再エクスポート
// 他のファイルからはこのファイル経由でインポートする
import type { InterviewerCategory } from '../../common/enums';
import { INTERVIEWER_CATEGORIES } from '../../common/enums';

export type { InterviewerCategory };
export { INTERVIEWER_CATEGORIES };
