import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';

/**
 * 姓と名をセットで扱うValue Object
 */
export class UserName {
  private constructor(
    private readonly firstName: string,
    private readonly lastName: string,
  ) {
    if (!firstName || firstName.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('名'));
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('姓'));
    }
  }

  /**
   * ファクトリメソッド
   */
  static create(props: { firstName: string; lastName: string }): UserName {
    return new UserName(props.firstName, props.lastName);
  }

  /**
   * 必須のファクトリメソッド
   */
  static createRequired(props: {
    firstName: string;
    lastName: string;
  }): UserName {
    return new UserName(props.firstName, props.lastName);
  }

  get firstNameValue(): string {
    return this.firstName;
  }

  get lastNameValue(): string {
    return this.lastName;
  }

  /**
   * フルネームを返す（ロジックはVOに持たせる）
   */
  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  /**
   * フォーマルな名前を返す（表示用ロジック）
   */
  get formalName(): string {
    return `${this.lastName} ${this.firstName} 様`;
  }

  /**
   * イニシャルを返す
   */
  get initials(): string {
    return `${this.lastName[0]}.${this.firstName[0]}`;
  }

  /**
   * 値による等価性の比較
   */
  equals(other: UserName | null): boolean {
    if (other === null) return false;
    return (
      this.firstName === other.firstName && this.lastName === other.lastName
    );
  }

  toString(): string {
    return this.fullName;
  }
}
