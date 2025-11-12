import { GroupEnrollment } from '../entities/group-enrollment.entity';

export interface IEnrollmentRepository {
  findById(id: string): Promise<GroupEnrollment | null>;
  findByGroupId(groupId: string): Promise<GroupEnrollment[]>;
  findByUserId(userId: string): Promise<GroupEnrollment[]>;
  findByUserInCourse(
    userId: string,
    courseId: string,
  ): Promise<GroupEnrollment | null>;
  create(data: Partial<GroupEnrollment>): Promise<GroupEnrollment>;
  delete(id: string): Promise<void>;
  deleteByGroupAndUser(groupId: string, userId: string): Promise<void>;
}

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY');
