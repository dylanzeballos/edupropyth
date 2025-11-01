import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IActivityRepository } from '../../../domain/interfaces/activity-repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/interfaces/activity-repository.interface';

@Injectable()
export class DeleteActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private activityRepository: IActivityRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.activityRepository.delete(id);
  }
}
