import { TopicHistory } from '../entities/topic-history.entity';
import { HistoryAction } from '../enums/history-action.enum';

export interface ITopicHistoryRepository {
  create(data: Partial<TopicHistory>): Promise<TopicHistory>;
  findById(id: string): Promise<TopicHistory | null>;
  findByTopicId(topicId: string): Promise<TopicHistory[]>;
  findByTopicIdAndVersion(
    topicId: string,
    version: HistoryAction,
  ): Promise<TopicHistory[]>;
  getLatestVersion(topicId: string): Promise<TopicHistory | null>;
  getNextVersionNumber(topicId: string): Promise<number>;
  compareVersions(
    topicId: string,
    version1: number,
    version2: number,
  ): Promise<{
    version1: TopicHistory;
    version2: TopicHistory;
    differences: any[];
  }>;
  update(id: string, data: Partial<TopicHistory>);
  delete(id: string): Promise<void>;
}

export const TOPIC_HISTORY_REPOSITORY = Symbol('TOPIC_HISTORY_REPOSITORY');
