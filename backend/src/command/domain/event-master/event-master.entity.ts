import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';
import type { LocationType } from '../../../common/enums';

interface EventMasterProps {
  id?: string;
  name: string;
  description?: string | null;
  type: LocationType;
  recruitYearId: number;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class EventMasterEntity {
  // プロパティは private または readonly にして外部からの直接変更を防ぐ
  readonly id?: string;
  private _name: string;
  private _description: string | null;
  private _type: LocationType;
  readonly recruitYearId: number;

  // 監査ログ系は readonly か、専用の更新メソッドで扱う
  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: EventMasterProps) {
    this.validateName(props.name);
    this.validateType(props.type);
    this.validateRecruitYearId(props.recruitYearId);

    this.id = props.id;
    this._name = props.name;
    this._description = props.description ?? null;
    this._type = props.type;
    this.recruitYearId = props.recruitYearId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: EventMasterProps): EventMasterEntity {
    return new EventMasterEntity(props);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get type() {
    return this._type;
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
   * イベントマスター情報の変更
   */
  public changeInfo(params: {
    name: string;
    description?: string | null;
    type: LocationType;
    updatedBy: string;
  }): void {
    this.validateName(params.name);
    this.validateType(params.type);

    this._name = params.name;
    this._description = params.description ?? null;
    this._type = params.type;
    this.markAsUpdated(params.updatedBy);
  }

  // =================================================================
  // 2. 不変条件の強制 (Validation)
  // =================================================================

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('イベント名'));
    }
  }

  private validateType(type: LocationType): void {
    if (!type || !['オンライン', '対面', 'オンライン_対面'].includes(type)) {
      throw new DomainError(REQUIRED_FIELD('ロケーションタイプ'));
    }
  }

  private validateRecruitYearId(recruitYearId: number): void {
    if (!recruitYearId || recruitYearId <= 0) {
      throw new DomainError(REQUIRED_FIELD('年度ID'));
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
  public equals(other: EventMasterEntity): boolean {
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
