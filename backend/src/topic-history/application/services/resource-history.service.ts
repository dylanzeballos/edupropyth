import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceHistory } from '../../domain/entities/resource-history.entity';
import { Resource } from '../../../courses/domain/entities/resource.entity';
import { User, UserRole } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../../domain/enums/history-action.enum';

@Injectable()
export class ResourceHistoryService {
  constructor(
    @InjectRepository(ResourceHistory)
    private readonly resourceHistoryRepository: Repository<ResourceHistory>,
  ) {}

  async createSnapshot(
    resource: Resource,
    user: User,
    action: HistoryAction,
    changes?: Record<string, unknown>,
    previousData?: Record<string, unknown>,
  ): Promise<ResourceHistory> {
    this.ensureEditor(user);
    const version = await this.getNextVersion(resource.id);

    const baseData = previousData ?? { ...resource };
    const entry = this.resourceHistoryRepository.create({
      resourceId: resource.id,
      topicId: resource.topicId,
      version,
      action,
      changes,
      previousData: baseData,
      currentData: this.mergeData(baseData, changes),
      editedBy: user,
      editedById: user.id,
    });

    return this.resourceHistoryRepository.save(entry);
  }

  async getResourceHistory(
    resourceId: string,
    user: User,
  ): Promise<ResourceHistory[]> {
    this.ensureEditor(user);
    return this.resourceHistoryRepository.find({
      where: { resourceId },
      relations: ['editedBy'],
      order: { version: 'DESC' },
    });
  }

  async getVersionById(id: string, user: User): Promise<ResourceHistory> {
    this.ensureEditor(user);
    const version = await this.resourceHistoryRepository.findOne({
      where: { id },
      relations: ['editedBy'],
    });

    if (!version) {
      throw new NotFoundException('Resource history version not found');
    }

    return version;
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
    this.ensureEditor(user);

    const version1 = await this.resourceHistoryRepository.findOne({
      where: { resourceId, version: fromVersion },
      relations: ['editedBy'],
    });
    const version2 = await this.resourceHistoryRepository.findOne({
      where: { resourceId, version: toVersion },
      relations: ['editedBy'],
    });

    if (!version1 || !version2) {
      throw new NotFoundException(
        'Unable to compare resource history versions',
      );
    }

    return {
      resourceId,
      version1,
      version2,
      differences: this.calculateDifferences(
        version1.currentData,
        version2.currentData,
      ),
    };
  }

  async getNextVersion(resourceId: string): Promise<number> {
    const latest = await this.resourceHistoryRepository.findOne({
      where: { resourceId },
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
