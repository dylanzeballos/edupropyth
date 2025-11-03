import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

@Injectable()
export class GetGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: string): Promise<Group> {
    const group = await this.groupRepo.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
}
