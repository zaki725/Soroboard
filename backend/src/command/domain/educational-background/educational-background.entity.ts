import { getCurrentDate } from '../../../common/utils/date.utils';
import type { EducationType } from './educational-background.types';
import { GraduationMonth } from '../value-objects/graduation-month.vo';
import { Id } from '../value-objects/id.vo';
import { ulid } from 'ulid';
import { DomainError } from '../../../common/errors/domain.error';

interface EducationalBackgroundProps {
  id?: string;
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
  readonly id: string; // createNewで生成されるか、既存データから復元される
  readonly _interviewerId: string;
  private _educationType: EducationType;
  private _universityId: string | null;
  private _facultyId: string | null;
  private _graduationYear?: number;
  private _graduationMonth: GraduationMonth | null;

  readonly createdAt?: Date;
  readonly createdBy?: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: EducationalBackgroundProps) {
    // IDが空文字列の場合はそのまま（createNewで生成される）
    this.id = props.id || '';
    this._interviewerId = Id.createRequired(
      props.interviewerId,
      '面接官ID',
    ).value;
    this._educationType = props.educationType;
    const univId = props.universityId
      ? Id.createRequired(props.universityId, '大学ID').value
      : null;
    const facId = props.facultyId
      ? Id.createRequired(props.facultyId, '学部ID').value
      : null;

    // 学歴区分と大学/学部IDの整合性をチェック
    this.validateConsistency(props.educationType, univId, facId);

    this._universityId = univId;
    this._facultyId = facId;
    this._graduationYear = props.graduationYear;
    this._graduationMonth = GraduationMonth.create(props.graduationMonth);
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド（新規作成用）
   */
  static createNew(props: {
    interviewerId: string;
    educationType: EducationType;
    universityId?: string;
    facultyId?: string;
    graduationYear?: number;
    graduationMonth?: number;
    createdBy: string;
    updatedBy: string;
  }): EducationalBackgroundEntity {
    // エンティティは生成された瞬間からアイデンティティ（ID）を持つ
    return new EducationalBackgroundEntity({
      id: ulid(),
      interviewerId: props.interviewerId,
      educationType: props.educationType,
      universityId: props.universityId,
      facultyId: props.facultyId,
      graduationYear: props.graduationYear,
      graduationMonth: props.graduationMonth,
      createdBy: props.createdBy,
      updatedBy: props.updatedBy,
    });
  }

  /**
   * エンティティのファクトリメソッド（既存データから復元用）
   */
  static create(
    props: EducationalBackgroundProps,
  ): EducationalBackgroundEntity {
    return new EducationalBackgroundEntity(props);
  }

  get interviewerId() {
    return this._interviewerId;
  }
  get educationType() {
    return this._educationType;
  }
  get universityId() {
    return this._universityId ?? undefined;
  }
  get facultyId() {
    return this._facultyId ?? undefined;
  }
  get graduationYear() {
    return this._graduationYear;
  }
  get graduationMonth() {
    return this._graduationMonth?.value ?? null;
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
    const univId = params.universityId
      ? Id.createRequired(params.universityId, '大学ID').value
      : null;
    const facId = params.facultyId
      ? Id.createRequired(params.facultyId, '学部ID').value
      : null;

    // 更新時も整合性チェックを実行
    this.validateConsistency(params.educationType, univId, facId);

    this._educationType = params.educationType;
    this._universityId = univId;
    this._facultyId = facId;
    this._graduationYear = params.graduationYear;
    this._graduationMonth = GraduationMonth.create(params.graduationMonth);
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * 学歴区分と大学/学部IDの整合性をチェックするドメインロジック
   */
  private validateConsistency(
    type: EducationType,
    universityId: string | null,
    facultyId: string | null,
  ): void {
    // 大学・大学院・短期大学卒の場合、大学IDと学部IDは必須
    if (type === '大学' || type === '大学院' || type === '短期大学') {
      if (!universityId || !facultyId) {
        throw new DomainError(
          '大学・大学院・短期大学卒の場合、大学と学部は必須です',
        );
      }
    }

    // 高校卒・専門学校卒・その他の場合、大学IDと学部IDは設定不可
    if (type === '高等学校' || type === '専門学校' || type === 'その他') {
      if (universityId || facultyId) {
        throw new DomainError(`${type}の場合、大学・学部IDは設定できません`);
      }
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
