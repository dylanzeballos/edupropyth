/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { Activity } from '../../../courses/domain/entities/activity.entity';
import { ActivityHistory } from '../../domain/entities/activity-history.entity';
import { User } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class ActivityHistoryService {
  async createSnapshot(
    activity: Activity,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<ActivityHistory> {
    throw new Error('Method not implemented.');
  }

  async getActivityHistory(
    activityId: string,
    user: User,
  ): Promise<ActivityHistory[]> {
    throw new Error('Method not implemented.');
  }

  async getVersionById(id: string, user: User): Promise<ActivityHistory> {
    throw new Error('Method not implemented.');
  }

  async compareVersions(
    activityId: string,
    fromVersion: number,
    toVersion: number,
    user: User,
  ): Promise<{
    activityId: string;
    version1: ActivityHistory;
    version2: ActivityHistory;
    differences: Record<string, { from: unknown; to: unknown }>;
  }> {
    throw new Error('Method not implemented.');
  }

  async getNextVersion(activityId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
