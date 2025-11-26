import { DomainError } from '../../../common/errors/domain.error';
import { REQUIRED_FIELD } from '../../../common/constants';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface SearchConditionProps {
  id?: string;
  formType: string;
  name: string;
  urlParams: string;
  recruitYearId: number | null;
  createdAt?: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
}

export class SearchConditionEntity {
  readonly id?: string;
  private _formType: string;
  private _name: string;
  private _urlParams: string;
  private _recruitYearId: number | null;

  readonly createdAt?: Date;
  readonly createdBy: string;
  private _updatedAt?: Date;
  private _updatedBy: string;

  private constructor(props: SearchConditionProps) {
    this.validateFormType(props.formType);
    this.validateName(props.name);
    this.validateUrlParams(props.urlParams);

    this.id = props.id;
    this._formType = props.formType;
    this._name = props.name;
    this._urlParams = props.urlParams;
    this._recruitYearId = props.recruitYearId;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this._updatedAt = props.updatedAt;
    this._updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: SearchConditionProps): SearchConditionEntity {
    return new SearchConditionEntity(props);
  }

  get formType() {
    return this._formType;
  }

  get name() {
    return this._name;
  }

  get urlParams() {
    return this._urlParams;
  }

  get recruitYearId() {
    return this._recruitYearId;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get updatedBy() {
    return this._updatedBy;
  }

  public update({
    name,
    urlParams,
    updatedBy,
  }: {
    name: string;
    urlParams: string;
    updatedBy: string;
  }): void {
    this.validateName(name);
    this.validateUrlParams(urlParams);

    const hasChanges = this._name !== name || this._urlParams !== urlParams;

    if (!hasChanges) {
      return;
    }

    this._name = name;
    this._urlParams = urlParams;
    this.markAsUpdated(updatedBy);
  }

  private validateFormType(formType: string): void {
    if (!formType || formType.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('フォームタイプ'));
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('名前'));
    }
  }

  private validateUrlParams(urlParams: string): void {
    if (!urlParams || urlParams.trim().length === 0) {
      throw new DomainError(REQUIRED_FIELD('URLパラメータ'));
    }
  }

  private markAsUpdated(by: string): void {
    this._updatedAt = getCurrentDate();
    this._updatedBy = by;
  }

  public equals(other: SearchConditionEntity): boolean {
    if (!this.id || !other.id) return false;
    return this.id === other.id;
  }

  public ensureId(): asserts this is this & { id: string } {
    if (!this.id) {
      throw new DomainError(REQUIRED_FIELD('ID'));
    }
  }
}
