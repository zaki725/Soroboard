import { Module } from '@nestjs/common';
import { DeviationValueCommandModule } from './deviation-value-command.module';

@Module({
  imports: [DeviationValueCommandModule],
})
export class DeviationValueModule {}
