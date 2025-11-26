import { Module } from '@nestjs/common';
import { FacultyQueryModule } from './faculty-query.module';
import { FacultyCommandModule } from './faculty-command.module';

@Module({
  imports: [FacultyQueryModule, FacultyCommandModule],
})
export class FacultyModule {}
