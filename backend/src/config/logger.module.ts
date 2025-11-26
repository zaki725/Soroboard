import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { TraceService } from '../common/services/trace.service';

@Global()
@Module({
  providers: [CustomLoggerService, TraceService],
  exports: [CustomLoggerService, TraceService],
})
export class LoggerModule {}
