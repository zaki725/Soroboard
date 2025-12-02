import type { InterviewerCategory } from '../../../query/types/interviewer.types';
import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface InterviewerProps {
  userId: string;
  category: InterviewerCategory;
  universityId?: string;
  facultyId?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class InterviewerEntity {
  readonly userId: string;
  private _category: InterviewerCategory;
  private _universityId?: string;
  private _facultyId?: string;

  readonly createdAt?: Date;
  readonly createdBy?: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: InterviewerProps) {
    this.validateUserId(props.userId);

    this.userId = props.userId;
    this._category = props.category;
    this._universityId = props.universityId;
    this._facultyId = props.facultyId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: InterviewerProps): InterviewerEntity {
    return new InterviewerEntity(props);
  }

  get category() {
    return this._category;
  }
  get universityId() {
    return this._universityId;
  }
  get facultyId() {
    return this._facultyId;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  /**
   * カテゴリの変更
   */
  public changeCategory(params: {
    category: InterviewerCategory;
    updatedBy: string;
  }): void {
    this._category = params.category;
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * 学歴情報の変更
   */
  public changeEducationalBackground(params: {
    universityId?: string;
    facultyId?: string;
    updatedBy: string;
  }): void {
    this._universityId = params.universityId;
    this._facultyId = params.facultyId;
    this.markAsUpdated(params.updatedBy);
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('ユーザーID'));
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: InterviewerEntity): boolean {
    return this.userId === other.userId;
  }
}
