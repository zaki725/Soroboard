import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface EventProps {
  id?: string;
  startTime: Date;
  endTime?: Date | null;
  notes?: string | null;
  eventMasterId: string;
  eventMasterName: string;
  locationId: string;
  locationName: string;
  address?: string | null;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class EventEntity {
  // プロパティは private または readonly にして外部からの直接変更を防ぐ
  readonly id?: string;
  private _startTime: Date;
  private _endTime: Date | null;
  private _notes: string | null;
  readonly eventMasterId: string;
  readonly eventMasterName: string;
  private _locationId: string;
  private _locationName: string;
  private _address: string | null;

  // 監査ログ系は readonly か、専用の更新メソッドで扱う
  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: EventProps) {
    this.validateStartTime(props.startTime);
    this.validateTimeRange(props.startTime, props.endTime);
    this.validateEventMasterId(props.eventMasterId);
    this.validateLocationId(props.locationId);

    this.id = props.id;
    this._startTime = props.startTime;
    this._endTime = props.endTime ?? null;
    this._notes = props.notes ?? null;
    this.eventMasterId = props.eventMasterId;
    this.eventMasterName = props.eventMasterName;
    this._locationId = props.locationId;
    this._locationName = props.locationName;
    this._address = props.address ?? null;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: EventProps): EventEntity {
    return new EventEntity(props);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get startTime() {
    return this._startTime;
  }
  get endTime() {
    return this._endTime;
  }
  get notes() {
    return this._notes;
  }
  get address() {
    return this._address;
  }
  get locationId() {
    return this._locationId;
  }
  get locationName() {
    return this._locationName;
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
   * イベント情報の変更
   */
  public changeInfo(params: {
    startTime: Date;
    endTime?: Date | null;
    notes?: string | null;
    locationId: string;
    locationName: string;
    address?: string | null;
    updatedBy: string;
  }): void {
    this.validateStartTime(params.startTime);
    this.validateTimeRange(params.startTime, params.endTime);
    this.validateLocationId(params.locationId);

    this._startTime = params.startTime;
    this._endTime = params.endTime ?? null;
    this._notes = params.notes ?? null;
    this._locationId = params.locationId;
    this._locationName = params.locationName;
    this._address = params.address ?? null;
    this.markAsUpdated(params.updatedBy);
  }

  // =================================================================
  // 2. 不変条件の強制 (Validation)
  // =================================================================

  private validateStartTime(startTime: Date): void {
    if (
      !startTime ||
      !(startTime instanceof Date) ||
      isNaN(startTime.getTime())
    ) {
      throw new DomainError(REQUIRED_FIELD('開始時刻'));
    }
  }

  private validateTimeRange(
    startTime: Date | null | undefined,
    endTime: Date | null | undefined,
  ): void {
    if (startTime && endTime) {
      if (startTime >= endTime) {
        throw new DomainError('開始時刻は終了時刻より前である必要があります');
      }
    }
  }

  private validateEventMasterId(eventMasterId: string): void {
    if (!eventMasterId || eventMasterId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('イベントマスターID'));
    }
  }

  private validateLocationId(locationId: string): void {
    if (!locationId || locationId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ロケーションID'));
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
  public equals(other: EventEntity): boolean {
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
