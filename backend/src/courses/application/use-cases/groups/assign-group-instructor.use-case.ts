import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

@Injectable()
export class AssignGroupInstructorUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(groupId: string, instructorId: string | null): Promise<Group> {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    const payload: Partial<Group> =
      instructorId === null ? { instructorId: undefined } : { instructorId };
    return this.groupRepo.update(groupId, payload);
  }
}
