import {
  DeviationValueEntity,
  CreateDeviationValueEntity,
  UpdateDeviationValueEntity,
} from './deviation-value.entity';

export interface IDeviationValueRepository {
  create(
    deviationValue: CreateDeviationValueEntity,
  ): Promise<DeviationValueEntity>;
  update(
    deviationValue: UpdateDeviationValueEntity,
  ): Promise<DeviationValueEntity>;
  delete({ id }: { id: string }): Promise<void>;
}
