import { Module } from '@nestjs/common';
import { TeacherRepository } from '../../command/infra/teacher/teacher.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  providers: [
    {
      provide: INJECTION_TOKENS.ITeacherRepository,
      useClass: TeacherRepository,
    },
  ],
  exports: [INJECTION_TOKENS.ITeacherRepository],
})
export class TeacherCommandModule {}

