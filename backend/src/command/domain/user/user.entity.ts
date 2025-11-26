import type { UserRole, Gender } from './user.types';
import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';
import { Email } from '../value-objects';

interface UserProps {
  id?: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class UserEntity {
  // プロパティは private または readonly にして外部からの直接変更を防ぐ
  readonly id?: string;
  private _email: Email;
  private _role: UserRole;
  private _firstName: string;
  private _lastName: string;
  private _gender: Gender | null;
  private _departmentId: string;

  // 監査ログ系は readonly か、専用の更新メソッドで扱う
  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: UserProps) {
    this.validateName(props.firstName, '名前');
    this.validateName(props.lastName, '姓');
    this.validateDepartmentId(props.departmentId);

    this.id = props.id;
    this._email = Email.createRequired(props.email);
    this._role = props.role;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._gender = props.gender;
    this._departmentId = props.departmentId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get email() {
    return this._email.value;
  }
  get role() {
    return this._role;
  }
  get firstName() {
    return this._firstName;
  }
  get lastName() {
    return this._lastName;
  }
  get gender() {
    return this._gender;
  }
  get departmentId() {
    return this._departmentId;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  // =================================================================
  // 1. ドメインの振る舞い (Behavior)
  // =================================================================

  /**
   * ユーザー基本情報の更新
   */
  public updateProfile(params: {
    firstName: string;
    lastName: string;
    gender: Gender | null;
    updatedBy: string;
  }): void {
    this.validateName(params.firstName, '名前');
    this.validateName(params.lastName, '姓');

    // 値が変わらない場合は更新しない
    const hasChanges =
      this._firstName !== params.firstName ||
      this._lastName !== params.lastName ||
      this._gender !== params.gender;

    if (!hasChanges) {
      return;
    }

    this._firstName = params.firstName;
    this._lastName = params.lastName;
    this._gender = params.gender;
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * メールアドレスの変更
   */
  public changeEmail(params: { email: string; updatedBy: string }): void {
    // 値が変わらない場合は更新しない
    if (this._email.value === params.email) {
      return;
    }
    this._email = Email.createRequired(params.email);
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * 権限の変更
   */
  public changeRole(params: { role: UserRole; updatedBy: string }): void {
    // 値が変わらない場合は更新しない
    if (this._role === params.role) {
      return;
    }
    this._role = params.role;
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * 部署の変更
   */
  public changeDepartment(params: {
    departmentId: string;
    updatedBy: string;
  }): void {
    this.validateDepartmentId(params.departmentId);
    // 値が変わらない場合は更新しない
    if (this._departmentId === params.departmentId) {
      return;
    }
    this._departmentId = params.departmentId;
    this.markAsUpdated(params.updatedBy);
  }

  // =================================================================
  // 2. 不変条件の強制 (Validation)
  // =================================================================

  private validateName(name: string, fieldName: string): void {
    if (!name || name.trim().length === 0) {
      const errorMessage: string = REQUIRED_FIELD(fieldName);
      throw new DomainError(errorMessage);
    }
  }

  private validateDepartmentId(departmentId: string): void {
    if (!departmentId || departmentId.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('部署ID'));
    }
  }

  // =================================================================
  // 3. 監査情報の更新ロジック
  // =================================================================
  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  // =================================================================
  // 4. 同一性の比較 (Identity)
  // =================================================================
  public equals(other: UserEntity): boolean {
    if (!this.id || !other.id) return false;
    return this.id === other.id;
  }

  /**
   * IDの存在保証 (DB保存後などに使用)
   */
  public ensureId(): asserts this is this & { id: string } {
    if (!this.id) {
      throw new DomainError('IDは必須です');
    }
  }
}
