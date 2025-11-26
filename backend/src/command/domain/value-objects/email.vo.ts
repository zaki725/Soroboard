import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';

/**
 * メールアドレスのValue Object
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  /**
   * メールアドレスのファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: string | null): Email | null {
    if (value === null || value.trim().length === 0) {
      return null;
    }
    return new Email(value);
  }

  /**
   * 必須メールアドレスのファクトリメソッド
   */
  static createRequired(value: string): Email {
    if (value === null || value.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('メールアドレス'));
    }
    return new Email(value);
  }

  get value(): string {
    return this._value;
  }

  /**
   * メールアドレスの検証
   */
  private validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new DomainError('メールアドレスの形式が正しくありません');
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: Email | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
