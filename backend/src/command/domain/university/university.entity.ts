import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

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
  private _name: string;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: UniversityProps) {
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
  static create(props: UniversityProps): UniversityEntity {
    return new UniversityEntity(props);
  }

  get name() {
    return this._name;
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
    if (this._name === params.name) {
      return;
    }
    this.validateName(params.name);
    this._name = params.name;
    this.markAsUpdated(params.updatedBy);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('大学名'));
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: UniversityEntity): boolean {
    return this.id === other.id;
  }
}

interface CreateUniversityProps {
  name: string;
  createdBy: string;
  updatedBy: string;
}

export class CreateUniversityEntity {
  private readonly _name: string;
  readonly createdBy: string;
  readonly updatedBy: string;

  constructor(props: CreateUniversityProps) {
    this.validateName(props.name);
    this._name = props.name;
    this.createdBy = props.createdBy;
    this.updatedBy = props.updatedBy;
  }

  get name() {
    return this._name;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('大学名'));
    }
  }
}

interface UpdateUniversityProps {
  id: string;
  name: string;
  updatedBy: string;
}

export class UpdateUniversityEntity {
  readonly id: string;
  private readonly _name: string;
  readonly updatedBy: string;

  constructor(props: UpdateUniversityProps) {
    this.validateId(props.id);
    this.validateName(props.name);
    this.id = props.id;
    this._name = props.name;
    this.updatedBy = props.updatedBy;
  }

  get name() {
    return this._name;
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('大学名'));
    }
  }
}
