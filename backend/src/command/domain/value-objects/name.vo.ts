import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';

/**
 * 名前のValue Object
 */
export class Name {
  private readonly _value: string;

  private constructor(value: string, fieldName: string) {
    this.validate(value, fieldName);
    this._value = value;
  }

  /**
   * 名前のファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(
    value: string | null | undefined,
    fieldName = '名前',
  ): Name | null {
    if (value === null || value === undefined || value.trim().length === 0) {
      return null;
    }
    return new Name(value, fieldName);
  }

  /**
   * 必須名前のファクトリメソッド
   */
  static createRequired(value: string, fieldName = '名前'): Name {
    if (value === null || value === undefined || value.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD(fieldName));
    }
    return new Name(value, fieldName);
  }

  get value(): string {
    return this._value;
  }

  /**
   * 名前の検証
   */
  private validate(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD(fieldName));
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: Name | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
