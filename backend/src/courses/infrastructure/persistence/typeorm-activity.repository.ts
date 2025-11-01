import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../domain/entities/activity.entity';
import { IActivityRepository } from '../../domain/interfaces/activity-repository.interface';

@Injectable()
export class TypeOrmActivityRepository implements IActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async create(activity: Partial<Activity>): Promise<Activity> {
    const newActivity = this.repository.create(activity);
    return this.repository.save(newActivity);
  }

  async findById(id: string): Promise<Activity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByTopicId(topicId: string): Promise<Activity[]> {
    return this.repository.find({
      where: { topicId },
      order: { order: 'ASC' },
    });
  }

  async update(id: string, activity: Partial<Activity>): Promise<Activity> {
    await this.repository.update(id, activity);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Activity with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async reorder(
    topicId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const { id, order } of orders) {
        await manager.update(Activity, { id, topicId }, { order });
      }
    });
  }
}
