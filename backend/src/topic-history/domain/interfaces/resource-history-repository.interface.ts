import { ResourceHistory } from '../entities/resource-history.entity';

export interface IResourceHistoryRepository {
  create(data: Partial<ResourceHistory>): Promise<ResourceHistory>;
  findById(id: string): Promise<ResourceHistory | null>;
  findByResourceId(resourceId: string): Promise<ResourceHistory[]>;
  findByTopicHistoryId(topicHistoryId: string): Promise<ResourceHistory[]>;
  update(id: string, data: Partial<ResourceHistory>): Promise<ResourceHistory>;
  delete(id: string): Promise<void>;
}
