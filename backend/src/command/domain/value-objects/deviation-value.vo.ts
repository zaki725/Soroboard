import { DomainError } from '../../../common/errors/domain.error';

/**
 * 偏差値のValue Object
 * 0以上100以下の値を表す
 */
export class DeviationValue {
  private readonly _value: number;

  private constructor(value: number) {
    this.validate(value);
    this._value = value;
  }

  /**
   * 偏差値のファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: number | null | undefined): DeviationValue | null {
    if (value === null || value === undefined) {
      return null;
    }
    return new DeviationValue(value);
  }

  /**
   * 必須偏差値のファクトリメソッド
   */
  static createRequired(value: number): DeviationValue {
    return new DeviationValue(value);
  }

  get value(): number {
    return this._value;
  }

  /**
   * 偏差値の検証
   */
  private validate(value: number): void {
    if (value < 0 || value > 100) {
      throw new DomainError('偏差値は0以上100以下である必要があります');
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: DeviationValue | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}
