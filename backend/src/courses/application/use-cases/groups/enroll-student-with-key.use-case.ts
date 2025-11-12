import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from 'src/courses/domain/entities/group.entity';
import { GroupEnrollment } from 'src/courses/domain/entities/group-enrollment.entity';
import { EnrollmentStatus } from 'src/courses/domain/enums/enrollment-status.enum';
import { CourseStatus } from 'src/courses/domain/enums/course-status.enum';

@Injectable()
export class EnrollStudentWithKeyUseCase {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupEnrollment)
    private readonly enrollmentRepository: Repository<GroupEnrollment>,
  ) {}

  async execute(
    userId: string,
    groupId: string,
    enrollmentKey: string,
  ): Promise<GroupEnrollment> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['course', 'enrollments'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!group.course || group.course.status !== CourseStatus.ACTIVE) {
      throw new ForbiddenException(
        'Solo puedes inscribirte en cursos activos. Este curso aún no está disponible o ya finalizó.',
      );
    }

    if (!group.isEnrollmentOpen) {
      throw new ForbiddenException('Enrollment for this group is closed');
    }

    const now = new Date();
    if (group.enrollmentStartDate && group.enrollmentStartDate > now) {
      throw new BadRequestException('Enrollment period has not started yet');
    }

    if (group.enrollmentEndDate && group.enrollmentEndDate < now) {
      throw new BadRequestException('Enrollment period has ended');
    }

    if (group.enrollmentKey && group.enrollmentKey !== enrollmentKey) {
      throw new BadRequestException('Invalid enrollment key');
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this group');
    }

    if (
      group.maxStudents &&
      group.enrollments &&
      group.enrollments.length >= group.maxStudents
    ) {
      throw new BadRequestException('Group has reached maximum capacity');
    }

    const enrollment = this.enrollmentRepository.create({
      groupId: groupId,
      userId: userId,
      status: EnrollmentStatus.ACTIVE,
      enrolledBy: 'self',
      enrolledAt: new Date(),
    });

    return await this.enrollmentRepository.save(enrollment);
  }
}
