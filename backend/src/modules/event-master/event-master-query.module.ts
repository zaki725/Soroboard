import { Module } from '@nestjs/common';
import { EventMasterController } from '../../query/controller/event-master/event-master.controller';
import { EventMasterService } from '../../query/application/event-master/event-master.service';
import { EventMasterDao } from '../../query/dao/event-master/event-master.dao';

@Module({
  controllers: [EventMasterController],
  providers: [EventMasterService, EventMasterDao],
})
export class EventMasterQueryModule {}
