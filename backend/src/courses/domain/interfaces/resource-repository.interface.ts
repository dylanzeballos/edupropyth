import { Resource } from '../entities/resource.entity';

export interface IResourceRepository {
  create(resource: Partial<Resource>): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
  findByTopicId(topicId: string): Promise<Resource[]>;
  update(id: string, resource: Partial<Resource>): Promise<Resource>;
  delete(id: string): Promise<void>;
  reorder(
    topicId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void>;
}

export const RESOURCE_REPOSITORY = Symbol('RESOURCE_REPOSITORY');
