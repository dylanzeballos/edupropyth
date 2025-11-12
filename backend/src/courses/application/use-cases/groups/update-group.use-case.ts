import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

interface UpdateGroupDto {
  name?: string;
  schedule?: string;
  instructorId?: string | null;
  isActive?: boolean;
  maxStudents?: number;
  enrollmentKey?: string;
  isEnrollmentOpen?: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
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
      schedule: dto.schedule,
      isActive: dto.isActive,
      instructorId:
        dto.instructorId === null ? undefined : (dto.instructorId ?? undefined),
      maxStudents: dto.maxStudents,
      enrollmentKey: dto.enrollmentKey,
      isEnrollmentOpen: dto.isEnrollmentOpen,
      enrollmentStartDate: dto.enrollmentStartDate
        ? new Date(dto.enrollmentStartDate)
        : undefined,
      enrollmentEndDate: dto.enrollmentEndDate
        ? new Date(dto.enrollmentEndDate)
        : undefined,
    };

    return this.groupRepo.update(id, payload);
  }
}
