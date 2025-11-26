import { EventEntity } from './event.entity';

export interface IEventRepository {
  create(
    event: EventEntity,
    interviewerIds: string[],
    userId: string,
  ): Promise<EventEntity>;
  update(
    event: EventEntity,
    interviewerIds: string[],
    userId: string,
  ): Promise<EventEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<EventEntity | null>;
}
