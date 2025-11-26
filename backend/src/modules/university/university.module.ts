import { Module } from '@nestjs/common';
import { UniversityQueryModule } from './university-query.module';
import { UniversityCommandModule } from './university-command.module';

@Module({
  imports: [UniversityQueryModule, UniversityCommandModule],
})
export class UniversityModule {}
