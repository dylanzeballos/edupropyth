import { Injectable } from '@nestjs/common';
import { TopicHistoryService } from '../services/topic-history.service';
import { ResourceHistoryService } from '../services/resource-history.service';
import { ActivityHistoryService } from '../services/activity-history.service';
import { Topic } from '../../../courses/domain/entities/topic.entity';
import { Resource } from '../../../courses/domain/entities/resource.entity';
import { Activity } from '../../../courses/domain/entities/activity.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';
import { User } from '../../../auth/domain/entities/user.entity';
import { TopicHistory } from '../../domain/entities/topic-history.entity';
import { ResourceHistory } from '../../domain/entities/resource-history.entity';
import { ActivityHistory } from '../../domain/entities/activity-history.entity';

export interface CreateTopicSnapshotCommand {
  topic: Topic;
  user: User;
  action: HistoryAction;
  topicChanges?: Record<string, unknown>;
  previousTopicData?: Record<string, unknown>;
  resourceChanges?: Array<{
    resource: Resource;
    changes?: Record<string, unknown>;
    previousData?: Record<string, unknown>;
  }>;
  activityChanges?: Array<{
    activity: Activity;
    changes?: Record<string, unknown>;
    previousData?: Record<string, unknown>;
  }>;
}

@Injectable()
export class CreateTopicSnapshotUseCase {
  constructor(
    private readonly topicHistoryService: TopicHistoryService,
    private readonly resourceHistoryService: ResourceHistoryService,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  async execute(command: CreateTopicSnapshotCommand): Promise<{
    topicHistory: TopicHistory;
    resourceHistories: ResourceHistory[];
    activityHistories: ActivityHistory[];
  }> {
    const { topic, user, action, topicChanges, previousTopicData } = command;

    const topicHistory = await this.topicHistoryService.createSnapshot(
      topic,
      user,
      action,
      topicChanges,
      previousTopicData,
    );

    const resourceHistories: ResourceHistory[] = [];
    if (command.resourceChanges?.length) {
      for (const change of command.resourceChanges) {
        const history = await this.resourceHistoryService.createSnapshot(
          change.resource,
          user,
          action,
          change.changes,
          change.previousData,
        );
        resourceHistories.push(history);
      }
    }

    const activityHistories: ActivityHistory[] = [];
    if (command.activityChanges?.length) {
      for (const change of command.activityChanges) {
        const history = await this.activityHistoryService.createSnapshot(
          change.activity,
          user,
          action,
          change.changes,
          change.previousData,
        );
        activityHistories.push(history);
      }
    }

    return {
      topicHistory,
      resourceHistories,
      activityHistories,
    };
  }
}
