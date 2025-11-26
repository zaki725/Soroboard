import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

export type EducationType =
  | '大学院'
  | '大学'
  | '短期大学'
  | '専門学校'
  | '高等学校'
  | 'その他';

interface CreateEducationalBackgroundProps {
  interviewerId: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
  createdBy: string;
  updatedBy: string;
}

export class CreateEducationalBackgroundEntity {
  readonly interviewerId: string;
  readonly educationType: EducationType;
  readonly universityId?: string;
  readonly facultyId?: string;
  private readonly _graduationYear?: number;
  private readonly _graduationMonth?: number;
  readonly createdBy: string;
  readonly updatedBy: string;

  constructor(props: CreateEducationalBackgroundProps) {
    this.validateInterviewerId(props.interviewerId);
    this.validateGraduationMonth(props.graduationMonth);
    this.interviewerId = props.interviewerId;
    this.educationType = props.educationType;
    this.universityId = props.universityId;
    this.facultyId = props.facultyId;
    this._graduationYear = props.graduationYear;
    this._graduationMonth = props.graduationMonth;
    this.createdBy = props.createdBy;
    this.updatedBy = props.updatedBy;
  }

  get graduationYear() {
    return this._graduationYear;
  }
  get graduationMonth() {
    return this._graduationMonth;
  }

  private validateInterviewerId(interviewerId: string): void {
    if (!interviewerId || interviewerId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('面接官ID'));
    }
  }

  private validateGraduationMonth(graduationMonth?: number): void {
    if (
      graduationMonth !== undefined &&
      (graduationMonth < 1 || graduationMonth > 12)
    ) {
      throw new DomainError('卒業月は1から12の範囲である必要があります');
    }
  }
}

interface UpdateEducationalBackgroundProps {
  id: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
  updatedBy: string;
}

export class UpdateEducationalBackgroundEntity {
  readonly id: string;
  readonly educationType: EducationType;
  readonly universityId?: string;
  readonly facultyId?: string;
  private readonly _graduationYear?: number;
  private readonly _graduationMonth?: number;
  readonly updatedBy: string;

  constructor(props: UpdateEducationalBackgroundProps) {
    this.validateId(props.id);
    this.validateGraduationMonth(props.graduationMonth);
    this.id = props.id;
    this.educationType = props.educationType;
    this.universityId = props.universityId;
    this.facultyId = props.facultyId;
    this._graduationYear = props.graduationYear;
    this._graduationMonth = props.graduationMonth;
    this.updatedBy = props.updatedBy;
  }

  get graduationYear() {
    return this._graduationYear;
  }
  get graduationMonth() {
    return this._graduationMonth;
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }

  private validateGraduationMonth(graduationMonth?: number): void {
    if (
      graduationMonth !== undefined &&
      (graduationMonth < 1 || graduationMonth > 12)
    ) {
      throw new DomainError('卒業月は1から12の範囲である必要があります');
    }
  }
}

interface EducationalBackgroundProps {
  id: string;
  interviewerId: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class EducationalBackgroundEntity {
  readonly id: string;
  readonly interviewerId: string;
  private _educationType: EducationType;
  private _universityId?: string;
  private _facultyId?: string;
  private _graduationYear?: number;
  private _graduationMonth?: number;

  readonly createdAt?: Date;
  readonly createdBy?: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: EducationalBackgroundProps) {
    this.validateGraduationMonth(props.graduationMonth);

    this.id = props.id;
    this.interviewerId = props.interviewerId;
    this._educationType = props.educationType;
    this._universityId = props.universityId;
    this._facultyId = props.facultyId;
    this._graduationYear = props.graduationYear;
    this._graduationMonth = props.graduationMonth;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(
    props: EducationalBackgroundProps,
  ): EducationalBackgroundEntity {
    return new EducationalBackgroundEntity(props);
  }

  get educationType() {
    return this._educationType;
  }
  get universityId() {
    return this._universityId;
  }
  get facultyId() {
    return this._facultyId;
  }
  get graduationYear() {
    return this._graduationYear;
  }
  get graduationMonth() {
    return this._graduationMonth;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  /**
   * 学歴情報の更新
   */
  public updateEducationInfo(params: {
    educationType: EducationType;
    universityId?: string;
    facultyId?: string;
    graduationYear?: number;
    graduationMonth?: number;
    updatedBy: string;
  }): void {
    this.validateGraduationMonth(params.graduationMonth);

    this._educationType = params.educationType;
    this._universityId = params.universityId;
    this._facultyId = params.facultyId;
    this._graduationYear = params.graduationYear;
    this._graduationMonth = params.graduationMonth;
    this.markAsUpdated(params.updatedBy);
  }

  private validateGraduationMonth(graduationMonth?: number): void {
    if (
      graduationMonth !== undefined &&
      (graduationMonth < 1 || graduationMonth > 12)
    ) {
      throw new DomainError('卒業月は1から12の範囲である必要があります');
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: EducationalBackgroundEntity): boolean {
    return this.id === other.id;
  }
}
