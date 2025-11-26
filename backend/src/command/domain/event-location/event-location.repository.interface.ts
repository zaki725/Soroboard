import { EventLocationEntity } from './event-location.entity';

export interface IEventLocationRepository {
  create(eventLocation: EventLocationEntity): Promise<EventLocationEntity>;
  update(eventLocation: EventLocationEntity): Promise<EventLocationEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<EventLocationEntity | null>;
}
