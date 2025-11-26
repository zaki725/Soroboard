import { Module } from '@nestjs/common';
import { EventQueryController } from '../../query/controller/event/event.controller';
import { EventService } from '../../query/application/event/event.service';
import { EventDao } from '../../query/dao/event/event.dao';

@Module({
  controllers: [EventQueryController],
  providers: [EventService, EventDao],
})
export class EventQueryModule {}
