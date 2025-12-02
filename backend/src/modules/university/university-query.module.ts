import { Module } from '@nestjs/common';
import { UniversityController } from '../../query/controller/university/university.controller';
import { UniversityService } from '../../query/application/university/university.service';
import { UniversityDao } from '../../query/dao/university/university.dao';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService, UniversityDao],
})
export class UniversityQueryModule {}
