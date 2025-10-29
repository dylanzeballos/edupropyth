import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { ITopicRepository } from '../../domain/interfaces/topic-repository.interface';
import { Topic } from '../../domain/entities/topic.entity';

@Injectable()
export class TypeOrmTopicRepository implements ITopicRepository {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async findById(id: string): Promise<Topic | null> {
    return await this.topicRepository.findOne({ where: { id } });
  }

  async findByCourseId(courseId: string): Promise<Topic[]> {
    return await this.topicRepository.find({
      where: { courseId },
      order: { order: 'ASC' },
    });
  }

  async findByOrder(courseId: string, order: number): Promise<Topic | null> {
    return await this.topicRepository.findOne({
      where: { courseId, order },
    });
  }

  async findByOrderExcludingId(
    courseId: string,
    order: number,
    excludeId: string,
  ): Promise<Topic | null> {
    return await this.topicRepository.findOne({
      where: {
        courseId,
        order,
        id: Not(excludeId),
      },
    });
  }

  async findByIds(ids: string[]): Promise<Topic[]> {
    return await this.topicRepository.find({
      where: { id: In(ids) },
    });
  }

  async create(topicData: Partial<Topic>): Promise<Topic> {
    const topic = this.topicRepository.create(topicData);
    return await this.topicRepository.save(topic);
  }

  async update(id: string, topicData: Partial<Topic>): Promise<Topic> {
    const topic = await this.findById(id);

    if (!topic) {
      throw new NotFoundException(`Tópico con ID ${id} no encontrado`);
    }

    Object.assign(topic, topicData);
    return await this.topicRepository.save(topic);
  }

  async updateOrder(id: string, order: number): Promise<void> {
    await this.topicRepository.update({ id }, { order });
  }

  async delete(id: string): Promise<void> {
    const topic = await this.findById(id);

    if (!topic) {
      throw new NotFoundException(`Tópico con ID ${id} no encontrado`);
    }

    await this.topicRepository.remove(topic);
  }

  async countByCourseId(courseId: string): Promise<number> {
    return await this.topicRepository.count({
      where: { courseId },
    });
  }
}
