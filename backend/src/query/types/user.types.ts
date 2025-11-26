// 型定義は common/enums から再エクスポート
// 他のファイルからはこのファイル経由でインポートする
import type { UserRole, Gender } from '../../common/enums';
import { USER_ROLES, GENDERS } from '../../common/enums';

export type { UserRole, Gender };
export { USER_ROLES, GENDERS };
