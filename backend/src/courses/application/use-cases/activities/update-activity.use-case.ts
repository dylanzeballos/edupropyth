import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IActivityRepository } from '../../../domain/interfaces/activity-repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/interfaces/activity-repository.interface';
import { Activity } from '../../../domain/entities/activity.entity';

@Injectable()
export class UpdateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private activityRepository: IActivityRepository,
  ) {}

  async execute(id: string, data: Partial<Activity>): Promise<Activity> {
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.activityRepository.update(id, data);
  }
}
