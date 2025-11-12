import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGroupRepository } from '../../domain/interfaces/group-repository.interface';
import { Group } from '../../domain/entities/group.entity';

@Injectable()
export class TypeOrmGroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(Group)
    private readonly repo: Repository<Group>,
  ) {}

  async findById(id: string): Promise<Group | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['enrollments'],
    });
  }

  async findByCourseId(courseId: string): Promise<Group[]> {
    return this.repo.find({
      where: { courseId },
      order: { name: 'ASC' },
      relations: ['enrollments'],
    });
  }

  async create(data: Partial<Group>): Promise<Group> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return (await this.findById(saved.id)) ?? saved;
  }

  async update(id: string, data: Partial<Group>): Promise<Group> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    Object.assign(entity, data);
    await this.repo.save(entity);
    const updated = await this.findById(id);
    return updated as Group;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    await this.repo.remove(entity);
  }
}
