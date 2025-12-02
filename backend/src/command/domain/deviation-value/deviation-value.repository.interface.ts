import type { DeviationValueEntity } from './deviation-value.entity';

export interface IDeviationValueRepository {
  create(deviationValue: DeviationValueEntity): Promise<DeviationValueEntity>;
  update(deviationValue: DeviationValueEntity): Promise<DeviationValueEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<DeviationValueEntity | null>;
}
