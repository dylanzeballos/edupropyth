import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { Group } from '../../../domain/entities/group.entity';

interface CreateGroupDto {
  courseId: string;
  name: string;
  schedule?: string;
  instructorId?: string;
  maxStudents?: number;
  enrollmentKey?: string;
  isEnrollmentOpen?: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
}

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(dto: CreateGroupDto): Promise<Group> {
    const course = await this.courseRepo.findById(dto.courseId);
    if (!course) throw new NotFoundException('Edition not found');

    return this.groupRepo.create({
      courseId: dto.courseId,
      name: dto.name,
      instructorId: dto.instructorId,
      isActive: true,
      maxStudents: dto.maxStudents,
      enrollmentKey: dto.enrollmentKey,
      isEnrollmentOpen: dto.isEnrollmentOpen ?? true,
      enrollmentStartDate: dto.enrollmentStartDate
        ? new Date(dto.enrollmentStartDate)
        : undefined,
      enrollmentEndDate: dto.enrollmentEndDate
        ? new Date(dto.enrollmentEndDate)
        : undefined,
    });
  }
}
