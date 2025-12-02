import { getCurrentDate } from '../../../common/utils/date.utils';
import { Name } from '../value-objects/name.vo';
import { ulid } from 'ulid';

interface UniversityProps {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class UniversityEntity {
  readonly id: string;
  private _name: Name;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: UniversityProps) {
    this.id = props.id;
    this._name = Name.createRequired(props.name, '大学名');
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド（新規作成用）
   */
  static createNew(props: {
    name: string;
    createdBy: string;
    updatedBy: string;
  }): UniversityEntity {
    // エンティティは生成された瞬間からアイデンティティ（ID）を持つ
    return new UniversityEntity({
      id: ulid(),
      name: props.name,
      createdAt: getCurrentDate(),
      createdBy: props.createdBy,
      updatedAt: getCurrentDate(),
      updatedBy: props.updatedBy,
    });
  }

  /**
   * エンティティのファクトリメソッド（既存データから復元用）
   */
  static create(props: UniversityProps): UniversityEntity {
    return new UniversityEntity(props);
  }

  get name() {
    return this._name.value;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  /**
   * 大学名の変更
   */
  public changeName(params: { name: string; updatedBy: string }): void {
    // 値が変わらない場合は更新しない
    if (this._name.value === params.name) {
      return;
    }
    this._name = Name.createRequired(params.name, '大学名');
    this.markAsUpdated(params.updatedBy);
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: UniversityEntity): boolean {
    return this.id === other.id;
  }
}
