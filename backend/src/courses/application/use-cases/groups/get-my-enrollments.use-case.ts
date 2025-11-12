import { Inject, Injectable } from '@nestjs/common';
import { ENROLLMENT_REPOSITORY } from 'src/courses/domain/interfaces/enrollment-repository.interface';
import type { IEnrollmentRepository } from 'src/courses/domain/interfaces/enrollment-repository.interface';
import { GroupEnrollment } from 'src/courses/domain/entities/group-enrollment.entity';

@Injectable()
export class GetMyEnrollmentsUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(userId: string): Promise<GroupEnrollment[]> {
    return this.enrollmentRepo.findByUserId(userId);
  }
}
