import { Injectable } from '@nestjs/common';
import { FacultyDao } from '../../dao/faculty/faculty.dao';
import { FacultyResponseDto } from '../../dto/faculty/faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private readonly facultyDao: FacultyDao) {}

  async findAllByUniversityId({
    universityId,
  }: {
    universityId: string;
  }): Promise<FacultyResponseDto[]> {
    const faculties = await this.facultyDao.findAllByUniversityId({
      universityId,
    });

    return faculties;
  }
}
