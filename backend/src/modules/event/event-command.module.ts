import { Module } from '@nestjs/common';
import { EventCommandController } from '../../command/controller/event/event.controller';
import { EventService } from '../../command/application/event/event.service';
import { EventBulkService } from '../../command/application/event/event-bulk.service';
import { EventRepository } from '../../command/infra/event/event.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';
import { EventMasterDao } from '../../query/dao/event-master/event-master.dao';
import { EventLocationDao } from '../../query/dao/event-location/event-location.dao';
import { EventDao } from '../../query/dao/event/event.dao';

@Module({
  controllers: [EventCommandController],
  providers: [
    EventService,
    EventBulkService,
    {
      provide: INJECTION_TOKENS.IEventRepository,
      useClass: EventRepository,
    },
    EventRepository,
    EventMasterDao,
    EventLocationDao,
    EventDao,
  ],
})
export class EventCommandModule {}
