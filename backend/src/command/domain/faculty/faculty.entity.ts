import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

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
  private _name: string;
  readonly universityId: string;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: FacultyProps) {
    this.validateName(props.name);
    this.validateUniversityId(props.universityId);

    this.id = props.id;
    this._name = props.name;
    this.universityId = props.universityId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: FacultyProps): FacultyEntity {
    return new FacultyEntity(props);
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
   * 学部名の変更
   */
  public changeName(params: { name: string; updatedBy: string }): void {
    this.validateName(params.name);
    this._name = params.name;
    this.markAsUpdated(params.updatedBy);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('学部名'));
    }
  }

  private validateUniversityId(universityId: string): void {
    if (!universityId || universityId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('大学ID'));
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: FacultyEntity): boolean {
    return this.id === other.id;
  }
}

interface CreateFacultyProps {
  name: string;
  universityId: string;
  createdBy: string;
  updatedBy: string;
}

export class CreateFacultyEntity {
  private readonly _name: string;
  readonly universityId: string;
  readonly createdBy: string;
  readonly updatedBy: string;

  constructor(props: CreateFacultyProps) {
    this.validateName(props.name);
    this.validateUniversityId(props.universityId);
    this._name = props.name;
    this.universityId = props.universityId;
    this.createdBy = props.createdBy;
    this.updatedBy = props.updatedBy;
  }

  get name() {
    return this._name;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('学部名'));
    }
  }

  private validateUniversityId(universityId: string): void {
    if (!universityId || universityId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('大学ID'));
    }
  }
}

interface UpdateFacultyProps {
  id: string;
  name: string;
  updatedBy: string;
}

export class UpdateFacultyEntity {
  readonly id: string;
  private readonly _name: string;
  readonly updatedBy: string;

  constructor(props: UpdateFacultyProps) {
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
      throw new DomainError(REQUIRED_FIELD('学部名'));
    }
  }
}
