import { Module } from '@nestjs/common';
import { EventLocationCommandController } from '../../command/controller/event-location/event-location.controller';
import { EventLocationService } from '../../command/application/event-location/event-location.service';
import { EventLocationRepository } from '../../command/infra/event-location/event-location.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [EventLocationCommandController],
  providers: [
    EventLocationService,
    {
      provide: INJECTION_TOKENS.IEventLocationRepository,
      useClass: EventLocationRepository,
    },
    EventLocationRepository,
  ],
})
export class EventLocationCommandModule {}
