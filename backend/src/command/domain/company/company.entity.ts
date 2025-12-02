import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';
import { Email, PhoneNumber, Url } from '../value-objects';

interface CompanyProps {
  id?: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  recruitYearId: number;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class CompanyEntity {
  // プロパティは private または readonly にして外部からの直接変更を防ぐ
  readonly id?: string;
  private _name: string;
  private _phoneNumber: PhoneNumber | null;
  private _email: Email | null;
  private _websiteUrl: Url | null;
  readonly recruitYearId: number; // 通常、作成後に所属年度は変わらない

  // 監査ログ系は readonly か、専用の更新メソッドで扱う
  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: CompanyProps) {
    this.validateName(props.name);

    this.id = props.id;
    this._name = props.name;
    this._phoneNumber = PhoneNumber.create(props.phoneNumber);
    this._email = Email.create(props.email);
    this._websiteUrl = Url.create(props.websiteUrl);
    this.recruitYearId = props.recruitYearId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: CompanyProps): CompanyEntity {
    return new CompanyEntity(props);
  }

  // =================================================================
  // Getter (必要なものだけ公開する)
  // =================================================================
  get name() {
    return this._name;
  }
  get phoneNumber() {
    return this._phoneNumber?.value ?? null;
  }
  get email() {
    return this._email?.value ?? null;
  }
  get websiteUrl() {
    return this._websiteUrl?.value ?? null;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get updatedBy() {
    return this._updatedBy;
  }

  // =================================================================
  // 1. ドメインの振る舞い (Behavior)
  //    ただのsetterではなく「何をするか」をメソッド名にする
  // =================================================================

  /**
   * 会社基本情報の更新
   * 名前が変わる際はバリデーションが再度走るようにする
   */
  public updateProfile(params: {
    name: string;
    websiteUrl: string | null;
    updatedBy: string;
  }): void {
    this.validateName(params.name);

    this._name = params.name;
    this._websiteUrl = Url.create(params.websiteUrl);
    this.markAsUpdated(params.updatedBy);
  }

  /**
   * 連絡先の変更
   * メールや電話番号の形式チェックを内包する
   */
  public changeContactInfo(params: {
    email: string | null;
    phoneNumber: string | null;
    updatedBy: string;
  }): void {
    this._email = Email.create(params.email);
    this._phoneNumber = PhoneNumber.create(params.phoneNumber);
    this.markAsUpdated(params.updatedBy);
  }

  // =================================================================
  // 2. 不変条件の強制 (Validation)
  //    インスタンスが存在する限り、常に正しい状態であることを保証する
  // =================================================================

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('会社名'));
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
  public equals(other: CompanyEntity): boolean {
    if (!this.id || !other.id) return false;
    return this.id === other.id;
  }

  /**
   * IDの存在保証 (DB保存後などに使用)
   */
  public ensureId(): asserts this is this & { id: string } {
    if (!this.id) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }
}
