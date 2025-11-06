import { Topic } from '../entities/topic.entity';

export interface ITopicRepository {
  findById(id: string): Promise<Topic | null>;
  findByCourseId(courseId: string): Promise<Topic[]>;
  findByOrder(courseId: string, order: number): Promise<Topic | null>;
  findByOrderExcludingId(
    courseId: string,
    order: number,
    excludeId: string,
  ): Promise<Topic | null>;
  findByIds(ids: string[]): Promise<Topic[]>;
  create(topicData: Partial<Topic>): Promise<Topic>;
  update(id: string, topicData: Partial<Topic>): Promise<Topic>;
  updateOrder(id: string, order: number): Promise<void>;
  reorder(
    courseId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void>;
  delete(id: string): Promise<void>;
  countByCourseId(courseId: string): Promise<number>;
}

export const TOPIC_REPOSITORY = Symbol('TOPIC_REPOSITORY');
