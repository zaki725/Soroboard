import { Injectable, Inject } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/department/department.repository.interface';
import { DepartmentEntity } from '../../domain/department/department.entity';
import { DepartmentResponseDto } from '../../../query/dto/department/department.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';

type CreateParams = {
  name: string;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(INJECTION_TOKENS.IDepartmentRepository)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async create(params: CreateParams): Promise<DepartmentResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const departmentEntity = DepartmentEntity.create({
      name: params.name,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.departmentRepository.create(departmentEntity);
    const createdWithId: DepartmentEntity & { id: string } =
      created as DepartmentEntity & { id: string };
    createdWithId.ensureId();
    return new DepartmentResponseDto({
      id: createdWithId.id,
      name: createdWithId.name,
    });
  }

  async update(params: UpdateParams): Promise<DepartmentResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existingDepartment = await this.departmentRepository.findOne({
      id: params.id,
    });

    if (!existingDepartment) {
      throw new NotFoundError('部署', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    existingDepartment.changeName({
      name: params.name,
      updatedBy: params.userId,
    });

    const updated = await this.departmentRepository.update(existingDepartment);
    const updatedWithId: DepartmentEntity & { id: string } =
      updated as DepartmentEntity & { id: string };
    updatedWithId.ensureId();
    return new DepartmentResponseDto({
      id: updatedWithId.id,
      name: updatedWithId.name,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.departmentRepository.delete({ id: params.id });
  }
}
