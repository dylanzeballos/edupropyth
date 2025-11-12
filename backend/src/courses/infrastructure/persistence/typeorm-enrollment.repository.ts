import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEnrollmentRepository } from '../../domain/interfaces/enrollment-repository.interface';
import { GroupEnrollment } from '../../domain/entities/group-enrollment.entity';

@Injectable()
export class TypeOrmEnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectRepository(GroupEnrollment)
    private readonly repo: Repository<GroupEnrollment>,
  ) {}

  async findById(id: string): Promise<GroupEnrollment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByGroupId(groupId: string): Promise<GroupEnrollment[]> {
    return this.repo.find({ where: { groupId, isActive: true } });
  }

  async findByUserId(userId: string): Promise<GroupEnrollment[]> {
    return this.repo.find({
      where: { userId, isActive: true },
      relations: ['group', 'group.course'],
    });
  }

  async findByUserInCourse(
    userId: string,
    courseId: string,
  ): Promise<GroupEnrollment | null> {
    return this.repo
      .createQueryBuilder('enr')
      .innerJoin('enr.group', 'grp')
      .where('enr.userId = :userId', { userId })
      .andWhere('grp.courseId = :courseId', { courseId })
      .andWhere('enr.isActive = true')
      .getOne();
  }

  async create(data: Partial<GroupEnrollment>): Promise<GroupEnrollment> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    await this.repo.remove(entity);
  }

  async deleteByGroupAndUser(groupId: string, userId: string): Promise<void> {
    const enrollment = await this.repo.findOne({ where: { groupId, userId } });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found for given group/user');
    }
    await this.repo.remove(enrollment);
  }
}
