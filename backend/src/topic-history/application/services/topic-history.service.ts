import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicHistory } from '../../domain/entities/topic-history.entity';
import { Topic } from '../../../courses/domain/entities/topic.entity';
import { User, UserRole } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class TopicHistoryService {
  constructor(
    @InjectRepository(TopicHistory)
    private readonly topicHistoryRepository: Repository<TopicHistory>,
  ) {}

  async createSnapshot(
    topic: Topic,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<TopicHistory> {
    this.ensureEditor(user);
    const version = await this.getNextVersion(topic.id);

    const baseData = previousData ?? { ...topic };
    const entry = this.topicHistoryRepository.create({
      topicId: topic.id,
      version,
      action,
      changes,
      previousData: baseData,
      currentData: this.mergeData(baseData, changes),
      editedBy: user,
      editedById: user.id,
    });

    return this.topicHistoryRepository.save(entry);
  }

  async getTopicHistory(topicId: string, user: User): Promise<TopicHistory[]> {
    this.ensureEditor(user);
    return this.topicHistoryRepository.find({
      where: { topicId },
      relations: ['editedBy'],
      order: { version: 'DESC' },
    });
  }

  async getVersionById(id: string, user: User): Promise<TopicHistory> {
    this.ensureEditor(user);
    const version = await this.topicHistoryRepository.findOne({
      where: { id },
      relations: ['editedBy'],
    });

    if (!version) {
      throw new NotFoundException('Topic history version not found');
    }

    return version;
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
    this.ensureEditor(user);

    const version1 = await this.topicHistoryRepository.findOne({
      where: { topicId, version: fromVersion },
      relations: ['editedBy'],
    });
    const version2 = await this.topicHistoryRepository.findOne({
      where: { topicId, version: toVersion },
      relations: ['editedBy'],
    });

    if (!version1 || !version2) {
      throw new NotFoundException('Unable to compare topic history versions');
    }

    return {
      topicId,
      version1,
      version2,
      differences: this.calculateDifferences(
        version1.currentData,
        version2.currentData,
      ),
    };
  }

  async getNextVersion(topicId: string): Promise<number> {
    const latest = await this.topicHistoryRepository.findOne({
      where: { topicId },
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
