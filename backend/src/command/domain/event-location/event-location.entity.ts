import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface EventLocationProps {
  id?: string;
  name: string;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class EventLocationEntity {
  // プロパティは private または readonly にして外部からの直接変更を防ぐ
  readonly id?: string;
  private _name: string;

  // 監査ログ系は readonly か、専用の更新メソッドで扱う
  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: EventLocationProps) {
    this.validateName(props.name);

    this.id = props.id;
    this._name = props.name;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: EventLocationProps): EventLocationEntity {
    return new EventLocationEntity(props);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get name() {
    return this._name;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  // =================================================================
  // 1. ドメインの振る舞い (Behavior)
  // =================================================================

  /**
   * ロケーション情報の変更
   */
  public changeName(params: { name: string; updatedBy: string }): void {
    this.validateName(params.name);

    this._name = params.name;
    this.markAsUpdated(params.updatedBy);
  }

  // =================================================================
  // 2. 不変条件の強制 (Validation)
  // =================================================================

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ロケーション名'));
    }
  }

  // =================================================================
  // 3. 監査情報の更新ロジック
  // =================================================================
  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  // =================================================================
  // 4. 同一性の比較 (Identity)
  // =================================================================
  public equals(other: EventLocationEntity): boolean {
    if (!this.id || !other.id) return false;
    return this.id === other.id;
  }

  /**
   * IDの存在保証 (DB保存後などに使用)
   */
  public ensureId(): asserts this is this & { id: string } {
    if (!this.id) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }
}
