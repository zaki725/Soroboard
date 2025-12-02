import type { EducationalBackgroundEntity } from './educational-background.entity';

export interface IEducationalBackgroundRepository {
  create(
    educationalBackground: EducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity>;

  findOne({ id }: { id: string }): Promise<EducationalBackgroundEntity | null>;

  findAllByInterviewerId({
    interviewerId,
  }: {
    interviewerId: string;
  }): Promise<EducationalBackgroundEntity[]>;

  update(
    educationalBackground: EducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity>;

  delete({ id }: { id: string }): Promise<void>;
}
