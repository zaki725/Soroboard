import { Module } from '@nestjs/common';
import { EventLocationQueryController } from '../../query/controller/event-location/event-location.controller';
import { EventLocationService } from '../../query/application/event-location/event-location.service';
import { EventLocationDao } from '../../query/dao/event-location/event-location.dao';

@Module({
  controllers: [EventLocationQueryController],
  providers: [EventLocationService, EventLocationDao],
})
export class EventLocationQueryModule {}
