import { getCurrentDate } from '../../../common/utils/date.utils';
import { Name } from '../value-objects/name.vo';
import { Id } from '../value-objects/id.vo';
import { ulid } from 'ulid';

interface FacultyProps {
  id: string;
  name: string;
  universityId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class FacultyEntity {
  readonly id: string;
  private _name: Name;
  readonly universityId: string;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: FacultyProps) {
    this.id = props.id;
    this._name = Name.createRequired(props.name, '学部名');
    this.universityId = Id.createRequired(props.universityId, '大学ID').value;
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
    universityId: string;
    createdBy: string;
    updatedBy: string;
  }): FacultyEntity {
    // エンティティは生成された瞬間からアイデンティティ（ID）を持つ
    return new FacultyEntity({
      id: ulid(),
      name: props.name,
      universityId: props.universityId,
      createdAt: getCurrentDate(),
      createdBy: props.createdBy,
      updatedAt: getCurrentDate(),
      updatedBy: props.updatedBy,
    });
  }

  /**
   * エンティティのファクトリメソッド（既存データから復元用）
   */
  static create(props: FacultyProps): FacultyEntity {
    return new FacultyEntity(props);
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
   * 学部名の変更
   */
  public changeName(params: { name: string; updatedBy: string }): void {
    this._name = Name.createRequired(params.name, '学部名');
    this.markAsUpdated(params.updatedBy);
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: FacultyEntity): boolean {
    return this.id === other.id;
  }
}
