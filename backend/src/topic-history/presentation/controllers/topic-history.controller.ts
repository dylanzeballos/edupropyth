import { Controller } from '@nestjs/common';
import { TopicHistoryService } from '../../application/services/topic-history.service';
import { TopicHistory } from '../../domain/entities/topic-history.entity';
import { User } from '../../../auth/domain/entities/user.entity';

@Controller('topic-history')
export class TopicHistoryController {
  constructor(private readonly topicHistoryService: TopicHistoryService) {}

  async getTopicHistory(topicId: string, user: User): Promise<TopicHistory[]> {
    return this.topicHistoryService.getTopicHistory(topicId, user);
  }

  async getVersionById(id: string, user: User): Promise<TopicHistory> {
    return this.topicHistoryService.getVersionById(id, user);
  }

  async compareVersions(
    topicId: string,
    versionA: number,
    versionB: number,
    user: User,
  ) {
    return this.topicHistoryService.compareVersions(
      topicId,
      versionA,
      versionB,
      user,
    );
  }
}
