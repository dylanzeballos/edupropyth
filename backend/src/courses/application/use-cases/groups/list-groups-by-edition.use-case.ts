import { Inject, Injectable } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

@Injectable()
export class ListGroupsByEditionUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(courseId: string): Promise<Group[]> {
    return this.groupRepo.findByCourseId(courseId);
  }
}
