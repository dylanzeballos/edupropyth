import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

interface UpdateGroupDto {
  name?: string;
  instructorId?: string | null;
  isActive?: boolean;
}

@Injectable()
export class UpdateGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepo.findById(id);
    if (!group) throw new NotFoundException('Group not found');
    const payload: Partial<Group> = {
      name: dto.name,
      isActive: dto.isActive,
      instructorId:
        dto.instructorId === null ? undefined : (dto.instructorId ?? undefined),
    };
    return this.groupRepo.update(id, payload);
  }
}
