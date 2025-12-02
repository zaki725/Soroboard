import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';

/**
 * IDのValue Object
 */
export class Id {
  private readonly _value: string;

  private constructor(value: string, fieldName: string) {
    this.validate(value, fieldName);
    this._value = value;
  }

  /**
   * IDのファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: string | null | undefined, fieldName = 'ID'): Id | null {
    if (value === null || value === undefined || value.trim().length === 0) {
      return null;
    }
    return new Id(value, fieldName);
  }

  /**
   * 必須IDのファクトリメソッド
   */
  static createRequired(value: string, fieldName = 'ID'): Id {
    if (value === null || value === undefined || value.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD(fieldName));
    }
    return new Id(value, fieldName);
  }

  get value(): string {
    return this._value;
  }

  /**
   * IDの検証
   */
  private validate(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD(fieldName));
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: Id | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
