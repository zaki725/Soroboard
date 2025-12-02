import { DomainError } from '../../../common/errors/domain.error';

/**
 * 電話番号のValue Object
 */
export class PhoneNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  /**
   * 電話番号のファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: string | null): PhoneNumber | null {
    if (value === null || value.trim().length === 0) {
      return null;
    }
    return new PhoneNumber(value);
  }

  get value(): string {
    return this._value;
  }

  /**
   * 電話番号の検証
   * 日本の電話番号フォーマット（簡易版）
   */
  private validate(value: string): void {
    // 数字、ハイフン、括弧のみ許可
    const phoneRegex = /^[0-9\-()]+$/;
    if (!phoneRegex.test(value)) {
      throw new DomainError('電話番号の形式が正しくありません');
    }
    // 桁数のチェック（最小7桁、最大15桁）
    const digitsOnly = value.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      throw new DomainError('電話番号の形式が正しくありません');
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: PhoneNumber | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
