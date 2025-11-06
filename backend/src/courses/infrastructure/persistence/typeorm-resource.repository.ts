import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../domain/entities/resource.entity';
import { IResourceRepository } from '../../domain/interfaces/resource-repository.interface';

@Injectable()
export class TypeOrmResourceRepository implements IResourceRepository {
  constructor(
    @InjectRepository(Resource)
    private readonly repository: Repository<Resource>,
  ) {}

  async create(resource: Partial<Resource>): Promise<Resource> {
    const newResource = this.repository.create(resource);
    return this.repository.save(newResource);
  }

  async findById(id: string): Promise<Resource | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByTopicId(topicId: string): Promise<Resource[]> {
    return this.repository.find({
      where: { topicId },
      order: { order: 'ASC' },
    });
  }

  async update(id: string, resource: Partial<Resource>): Promise<Resource> {
    await this.repository.update(id, resource);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Resource with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async reorder(
    topicId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const { id, order } of orders) {
        await manager.update(Resource, { id, topicId }, { order });
      }
    });
  }
}
