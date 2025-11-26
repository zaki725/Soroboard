import { Module } from '@nestjs/common';
import { EventMasterQueryModule } from './event-master-query.module';
import { EventMasterCommandModule } from './event-master-command.module';

@Module({
  imports: [EventMasterQueryModule, EventMasterCommandModule],
})
export class EventMasterModule {}
