import { getCurrentDate } from '../../../common/utils/date.utils';
import { DeviationValue as DeviationValueVO } from '../value-objects/deviation-value.vo';
import { Id } from '../value-objects/id.vo';
import { ulid } from 'ulid';

interface DeviationValueProps {
  id: string;
  facultyId: string;
  value: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class DeviationValueEntity {
  readonly id: string;
  readonly facultyId: string;
  private _value: DeviationValueVO;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: DeviationValueProps) {
    this.id = Id.createRequired(props.id, 'ID').value;
    this.facultyId = Id.createRequired(props.facultyId, '学部ID').value;
    this._value = DeviationValueVO.createRequired(props.value);
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド（新規作成用）
   */
  static createNew(props: {
    facultyId: string;
    value: number;
    createdBy: string;
    updatedBy: string;
  }): DeviationValueEntity {
    // エンティティは生成された瞬間からアイデンティティ（ID）を持つ
    return new DeviationValueEntity({
      id: ulid(),
      facultyId: props.facultyId,
      value: props.value,
      createdAt: getCurrentDate(),
      createdBy: props.createdBy,
      updatedAt: getCurrentDate(),
      updatedBy: props.updatedBy,
    });
  }

  /**
   * エンティティのファクトリメソッド（既存データから復元用）
   */
  static create(props: DeviationValueProps): DeviationValueEntity {
    return new DeviationValueEntity(props);
  }

  get value() {
    return this._value.value;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  /**
   * 偏差値の変更
   */
  public changeValue(params: { value: number; updatedBy: string }): void {
    this._value = DeviationValueVO.createRequired(params.value);
    this.markAsUpdated(params.updatedBy);
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: DeviationValueEntity): boolean {
    return this.id === other.id;
  }
}
