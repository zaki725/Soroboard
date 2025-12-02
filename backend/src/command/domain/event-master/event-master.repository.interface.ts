import { EventMasterEntity } from './event-master.entity';

export interface IEventMasterRepository {
  create(eventMaster: EventMasterEntity): Promise<EventMasterEntity>;
  update(eventMaster: EventMasterEntity): Promise<EventMasterEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<EventMasterEntity | null>;
}
