import { Group } from '../entities/group.entity';

export interface IGroupRepository {
  findById(id: string): Promise<Group | null>;
  findByCourseId(courseId: string): Promise<Group[]>;
  create(data: Partial<Group>): Promise<Group>;
  update(id: string, data: Partial<Group>): Promise<Group>;
  delete(id: string): Promise<void>;
}

export const GROUP_REPOSITORY = Symbol('GROUP_REPOSITORY');
