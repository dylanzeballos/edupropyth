/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { TopicHistory } from '../../domain/entities/topic-history.entity';
import { Topic } from '../../../courses/domain/entities/topic.entity';
import { User } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class TopicHistoryService {
  async createSnapshot(
    topic: Topic,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<TopicHistory> {
    throw new Error('Method not implemented.');
  }

  async getTopicHistory(topicId: string, user: User): Promise<TopicHistory[]> {
    throw new Error('Method not implemented.');
  }

  async getVersionById(id: string, user: User): Promise<TopicHistory> {
    throw new Error('Method not implemented.');
  }

  async compareVersions(
    topicId: string,
    fromVersion: number,
    toVersion: number,
    user: User,
  ): Promise<{
    topicId: string;
    version1: TopicHistory;
    version2: TopicHistory;
    differences: Record<string, { from: unknown; to: unknown }>;
  }> {
    throw new Error('Method not implemented.');
  }

  async getNextVersion(topicId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
