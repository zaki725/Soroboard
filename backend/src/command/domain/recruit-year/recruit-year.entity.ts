import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface RecruitYearProps {
  recruitYear: number;
  displayName: string;
  themeColor: string;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class RecruitYearEntity {
  readonly recruitYear: number;
  private _displayName: string;
  private _themeColor: string;

  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: RecruitYearProps) {
    this.validateRecruitYear(props.recruitYear);
    this.validateDisplayName(props.displayName);
    this.validateThemeColor(props.themeColor);

    this.recruitYear = props.recruitYear;
    this._displayName = props.displayName;
    this._themeColor = props.themeColor;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: RecruitYearProps): RecruitYearEntity {
    return new RecruitYearEntity(props);
  }

  get displayName() {
    return this._displayName;
  }
  get themeColor() {
    return this._themeColor;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  /**
   * 表示名の変更
   */
  public changeDisplayName(params: {
    displayName: string;
    updatedBy: string;
  }): void {
    this.validateDisplayName(params.displayName);
    this._displayName = params.displayName;
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * テーマカラーの変更
   */
  public changeThemeColor(params: {
    themeColor: string;
    updatedBy: string;
  }): void {
    this.validateThemeColor(params.themeColor);
    this._themeColor = params.themeColor;
    this.markAsUpdated(params.updatedBy);
  }

  private validateRecruitYear(recruitYear: number): void {
    if (!recruitYear || recruitYear < 2000 || recruitYear > 3000) {
      throw new DomainError('年度は2000から3000の範囲である必要があります');
    }
  }

  private validateDisplayName(displayName: string): void {
    if (!displayName || displayName.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('表示名'));
    }
  }

  private validateThemeColor(themeColor: string): void {
    if (!themeColor || themeColor.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('テーマカラー'));
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: RecruitYearEntity): boolean {
    return this.recruitYear === other.recruitYear;
  }
}
