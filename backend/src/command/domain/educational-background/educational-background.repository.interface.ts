import type {
  CreateEducationalBackgroundEntity,
  UpdateEducationalBackgroundEntity,
  EducationalBackgroundEntity,
} from './educational-background.entity';

export interface IEducationalBackgroundRepository {
  create(
    educationalBackground: CreateEducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity>;

  findOne({ id }: { id: string }): Promise<EducationalBackgroundEntity | null>;

  findAllByInterviewerId({
    interviewerId,
  }: {
    interviewerId: string;
  }): Promise<EducationalBackgroundEntity[]>;

  update(
    educationalBackground: UpdateEducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity>;

  delete({ id }: { id: string }): Promise<void>;
}
