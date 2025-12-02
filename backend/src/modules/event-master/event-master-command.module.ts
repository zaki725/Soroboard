import { Module } from '@nestjs/common';
import { EventMasterController } from '../../command/controller/event-master/event-master.controller';
import { EventMasterService } from '../../command/application/event-master/event-master.service';
import { EventMasterRepository } from '../../command/infra/event-master/event-master.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [EventMasterController],
  providers: [
    EventMasterService,
    {
      provide: INJECTION_TOKENS.IEventMasterRepository,
      useClass: EventMasterRepository,
    },
    EventMasterRepository,
  ],
})
export class EventMasterCommandModule {}
