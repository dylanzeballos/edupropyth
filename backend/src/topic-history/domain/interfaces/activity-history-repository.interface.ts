import { ActivityHistory } from '../entities/activity-history.entity';

export interface IActivityHistoryRepository {
  create(data: Partial<ActivityHistory>): Promise<ActivityHistory>;
  findById(id: string): Promise<ActivityHistory | null>;
  findByActivityId(activityId: string): Promise<ActivityHistory[]>;
  findByTopicHistoryId(topicHistoryId: string): Promise<ActivityHistory[]>;
  update(id: string, data: Partial<ActivityHistory>): Promise<ActivityHistory>;
  delete(id: string): Promise<void>;
}

export const ACTIVITY_HISTORY_REPOSITORY = Symbol(
  'ACTIVITY_HISTORY_REPOSITORY',
);
