import { Activity } from '../entities/activity.entity';

export interface IActivityRepository {
  create(activity: Partial<Activity>): Promise<Activity>;
  findById(id: string): Promise<Activity | null>;
  findByTopicId(topicId: string): Promise<Activity[]>;
  update(id: string, activity: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;
  reorder(
    topicId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void>;
}

export const ACTIVITY_REPOSITORY = Symbol('ACTIVITY_REPOSITORY');
