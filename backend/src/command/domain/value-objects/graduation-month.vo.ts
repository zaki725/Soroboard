import { DomainError } from '../../../common/errors/domain.error';

/**
 * 卒業月のValue Object
 * 1から12の範囲の値を表す
 */
export class GraduationMonth {
  private readonly _value: number;

  private constructor(value: number) {
    this.validate(value);
    this._value = value;
  }

  /**
   * 卒業月のファクトリメソッド
   * null許容の場合はnullを返す
   */
  static create(value: number | null | undefined): GraduationMonth | null {
    if (value === null || value === undefined) {
      return null;
    }
    return new GraduationMonth(value);
  }

  /**
   * 必須卒業月のファクトリメソッド
   */
  static createRequired(value: number): GraduationMonth {
    return new GraduationMonth(value);
  }

  get value(): number {
    return this._value;
  }

  /**
   * 卒業月の検証
   */
  private validate(value: number): void {
    if (value < 1 || value > 12) {
      throw new DomainError('卒業月は1から12の範囲である必要があります');
    }
  }

  /**
   * 値による等価性の比較
   */
  equals(other: GraduationMonth | null): boolean {
    if (other === null) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}
