import { Module } from '@nestjs/common';
import { EventLocationQueryModule } from './event-location-query.module';
import { EventLocationCommandModule } from './event-location-command.module';

@Module({
  imports: [EventLocationQueryModule, EventLocationCommandModule],
})
export class EventLocationModule {}
