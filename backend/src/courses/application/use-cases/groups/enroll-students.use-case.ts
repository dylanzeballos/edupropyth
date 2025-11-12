import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ENROLLMENT_REPOSITORY } from '../../../domain/interfaces/enrollment-repository.interface';
import type { IEnrollmentRepository } from '../../../domain/interfaces/enrollment-repository.interface';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';
import { GroupEnrollment } from '../../../domain/entities/group-enrollment.entity';

interface EnrollStudentsDto {
  groupId: string;
  userIds: string[];
}

@Injectable()
export class EnrollStudentsUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(dto: EnrollStudentsDto): Promise<GroupEnrollment[]> {
    const group = await this.groupRepo.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');

    const results: GroupEnrollment[] = [];
    for (const userId of dto.userIds) {
      const existing = await this.enrollmentRepo.findByUserInCourse(
        userId,
        group.courseId,
      );
      if (existing) {
        throw new ConflictException(
          `User ${userId} is already enrolled in this edition`,
        );
      }
      const enrollment = await this.enrollmentRepo.create({
        groupId: dto.groupId,
        userId,
        isActive: true,
      });
      results.push(enrollment);
    }
    return results;
  }
}
