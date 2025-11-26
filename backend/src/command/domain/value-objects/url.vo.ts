import { DomainError } from '../../../common/errors/domain.error';
import { INVALID_FORMAT } from '../../../common/constants';

/**
 * URLのValue Object
 */
export class Url {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  /**
   * URLのファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: string | null): Url | null {
    if (value === null || value.trim().length === 0) {
      return null;
    }
    return new Url(value);
  }

  get value(): string {
    return this._value;
  }

  /**
   * URLの検証
   */
  private validate(value: string): void {
    try {
      const url = new URL(value);
      // http または https スキームのみ許可
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new DomainError(INVALID_FORMAT('URL'));
      }
    } catch {
      throw new DomainError(INVALID_FORMAT('URL'));
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: Url | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
