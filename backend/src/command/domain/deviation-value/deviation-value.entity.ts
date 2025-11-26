import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

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
  private _value: number;

  readonly createdAt: Date;
  readonly createdBy: string;
  private _updatedAt: Date;
  private _updatedBy: string;

  private constructor(props: DeviationValueProps) {
    this.validateFacultyId(props.facultyId);
    this.validateValue(props.value);

    this.id = props.id;
    this.facultyId = props.facultyId;
    this._value = props.value;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: DeviationValueProps): DeviationValueEntity {
    return new DeviationValueEntity(props);
  }

  get value() {
    return this._value;
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
    this.validateValue(params.value);
    this._value = params.value;
    this.markAsUpdated(params.updatedBy);
  }

  private validateFacultyId(facultyId: string): void {
    if (!facultyId || facultyId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('学部ID'));
    }
  }

  private validateValue(value: number): void {
    if (value < 0 || value > 100) {
      throw new DomainError('偏差値は0以上100以下である必要があります');
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: DeviationValueEntity): boolean {
    return this.id === other.id;
  }
}

interface CreateDeviationValueProps {
  facultyId: string;
  value: number;
  createdBy: string;
  updatedBy: string;
}

export class CreateDeviationValueEntity {
  readonly facultyId: string;
  private readonly _value: number;
  readonly createdBy: string;
  readonly updatedBy: string;

  constructor(props: CreateDeviationValueProps) {
    this.validateFacultyId(props.facultyId);
    this.validateValue(props.value);
    this.facultyId = props.facultyId;
    this._value = props.value;
    this.createdBy = props.createdBy;
    this.updatedBy = props.updatedBy;
  }

  get value() {
    return this._value;
  }

  private validateFacultyId(facultyId: string): void {
    if (!facultyId || facultyId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('学部ID'));
    }
  }

  private validateValue(value: number): void {
    if (value < 0 || value > 100) {
      throw new DomainError('偏差値は0以上100以下である必要があります');
    }
  }
}

interface UpdateDeviationValueProps {
  id: string;
  value: number;
  updatedBy: string;
}

export class UpdateDeviationValueEntity {
  readonly id: string;
  private readonly _value: number;
  readonly updatedBy: string;

  constructor(props: UpdateDeviationValueProps) {
    this.validateId(props.id);
    this.validateValue(props.value);
    this.id = props.id;
    this._value = props.value;
    this.updatedBy = props.updatedBy;
  }

  get value() {
    return this._value;
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }

  private validateValue(value: number): void {
    if (value < 0 || value > 100) {
      throw new DomainError('偏差値は0以上100以下である必要があります');
    }
  }
}
