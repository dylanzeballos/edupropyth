import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseBlueprintRepository } from '../../domain/interfaces/course-blueprint-repository.interface';
import { CourseBlueprint } from '../../domain/entities/course-blueprint.entity';

@Injectable()
export class TypeOrmCourseBlueprintRepository
  implements ICourseBlueprintRepository
{
  constructor(
    @InjectRepository(CourseBlueprint)
    private readonly repo: Repository<CourseBlueprint>,
  ) {}

  async findById(id: string): Promise<CourseBlueprint | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<CourseBlueprint[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<CourseBlueprint>): Promise<CourseBlueprint> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    data: Partial<CourseBlueprint>,
  ): Promise<CourseBlueprint> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Blueprint with ID ${id} not found`);
    }
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Blueprint with ID ${id} not found`);
    }
    await this.repo.remove(entity);
  }
}
