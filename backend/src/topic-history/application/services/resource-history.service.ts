/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { ResourceHistory } from '../../domain/entities/resource-history.entity';
import { Resource } from '../../../courses/domain/entities/resource.entity';
import { User } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class ResourceHistoryService {
  async createSnapshot(
    resource: Resource,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<ResourceHistory> {
    throw new Error('Method not implemented.');
  }

  async getResourceHistory(
    resourceId: string,
    user: User,
  ): Promise<ResourceHistory[]> {
    throw new Error('Method not implemented.');
  }

  async getVersionById(id: string, user: User): Promise<ResourceHistory> {
    throw new Error('Method not implemented.');
  }

  async compareVersions(
    resourceId: string,
    fromVersion: number,
    toVersion: number,
    user: User,
  ): Promise<{
    resourceId: string;
    version1: ResourceHistory;
    version2: ResourceHistory;
    differences: Record<string, { from: unknown; to: unknown }>;
  }> {
    throw new Error('Method not implemented.');
  }

  async getNextVersion(resourceId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
