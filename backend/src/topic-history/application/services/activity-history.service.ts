import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityHistory } from '../../domain/entities/activity-history.entity';
import { Activity } from '../../../courses/domain/entities/activity.entity';
import { User, UserRole } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class ActivityHistoryService {
  constructor(
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
  ) {}

  async createSnapshot(
    activity: Activity,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<ActivityHistory> {
    this.ensureEditor(user);
    const version = await this.getNextVersion(activity.id);

    const baseData = previousData ?? { ...activity };
    const entry = this.activityHistoryRepository.create({
      activityId: activity.id,
      topicId: activity.topicId,
      version,
      action,
      changes,
      previousData: baseData,
      currentData: this.mergeData(baseData, changes),
      editedBy: user,
      editedById: user.id,
    });

    return this.activityHistoryRepository.save(entry);
  }

  async getActivityHistory(
    activityId: string,
    user: User,
  ): Promise<ActivityHistory[]> {
    this.ensureEditor(user);
    return this.activityHistoryRepository.find({
      where: { activityId },
      relations: ['editedBy'],
      order: { version: 'DESC' },
    });
  }

  async getVersionById(id: string, user: User): Promise<ActivityHistory> {
    this.ensureEditor(user);
    const version = await this.activityHistoryRepository.findOne({
      where: { id },
      relations: ['editedBy'],
    });

    if (!version) {
      throw new NotFoundException('Activity history version not found');
    }

    return version;
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
    this.ensureEditor(user);

    const version1 = await this.activityHistoryRepository.findOne({
      where: { activityId, version: fromVersion },
      relations: ['editedBy'],
    });
    const version2 = await this.activityHistoryRepository.findOne({
      where: { activityId, version: toVersion },
      relations: ['editedBy'],
    });

    if (!version1 || !version2) {
      throw new NotFoundException(
        'Unable to compare activity history versions',
      );
    }

    return {
      activityId,
      version1,
      version2,
      differences: this.calculateDifferences(
        version1.currentData,
        version2.currentData,
      ),
    };
  }

  async getNextVersion(activityId: string): Promise<number> {
    const latest = await this.activityHistoryRepository.findOne({
      where: { activityId },
      order: { version: 'DESC' },
    });

    return latest ? latest.version + 1 : 1;
  }

  private ensureEditor(user: User): void {
    if (
      !user ||
      (user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER_EDITOR)
    ) {
      throw new ForbiddenException(
        'Solo administradores o docentes editores pueden ver el historial',
      );
    }
  }

  private mergeData(
    base: Record<string, unknown>,
    changes?: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!changes) {
      return base;
    }
    return { ...base, ...changes };
  }

  private calculateDifferences(
    previous?: Record<string, unknown>,
    current?: Record<string, unknown>,
  ): Record<string, { from: unknown; to: unknown }> {
    const differences: Record<string, { from: unknown; to: unknown }> = {};
    const keys = new Set([
      ...(previous ? Object.keys(previous) : []),
      ...(current ? Object.keys(current) : []),
    ]);

    keys.forEach((key) => {
      const fromValue = previous?.[key];
      const toValue = current?.[key];
      if (JSON.stringify(fromValue) !== JSON.stringify(toValue)) {
        differences[key] = { from: fromValue, to: toValue };
      }
    });

    return differences;
  }
}
