import { Module } from '@nestjs/common';
import { EventQueryModule } from './event-query.module';
import { EventCommandModule } from './event-command.module';

@Module({
  imports: [EventQueryModule, EventCommandModule],
})
export class EventModule {}
