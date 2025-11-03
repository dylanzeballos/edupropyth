import { Inject, Injectable } from '@nestjs/common';
import { ENROLLMENT_REPOSITORY } from '../../../domain/interfaces/enrollment-repository.interface';
import type { IEnrollmentRepository } from '../../../domain/interfaces/enrollment-repository.interface';

@Injectable()
export class RemoveEnrollmentUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(groupId: string, userId: string): Promise<void> {
    await this.enrollmentRepo.deleteByGroupAndUser(groupId, userId);
  }
}
