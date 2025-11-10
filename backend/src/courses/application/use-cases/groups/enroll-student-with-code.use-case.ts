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

@Injectable()
export class EnrollStudentWithCodeUseCase {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupEnrollment)
    private readonly enrollmentRepository: Repository<GroupEnrollment>,
  ) {}

  async execute(
    userId: string,
    enrollmentKey: string,
  ): Promise<GroupEnrollment> {
    const group = await this.groupRepository.findOne({
      where: { enrollmentKey: enrollmentKey },
      relations: ['course', 'enrollments'],
    });

    if (!group) {
      throw new NotFoundException(
        'No se encontró ningún grupo con ese código de matrícula',
      );
    }

    if (!group.isEnrollmentOpen) {
      throw new ForbiddenException('La matrícula para este grupo está cerrada');
    }

    const now = new Date();
    if (group.enrollmentStartDate && group.enrollmentStartDate > now) {
      throw new BadRequestException(
        'El período de matrícula aún no ha comenzado',
      );
    }

    if (group.enrollmentEndDate && group.enrollmentEndDate < now) {
      throw new BadRequestException('El período de matrícula ha finalizado');
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        groupId: group.id,
        userId: userId,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Ya estás matriculado en este grupo');
    }

    if (
      group.maxStudents &&
      group.enrollments &&
      group.enrollments.length >= group.maxStudents
    ) {
      throw new BadRequestException(
        'El grupo ha alcanzado el límite de estudiantes',
      );
    }

    const enrollment = this.enrollmentRepository.create({
      groupId: group.id,
      userId: userId,
      status: EnrollmentStatus.ACTIVE,
      enrolledBy: 'self',
      enrolledAt: new Date(),
    });

    return await this.enrollmentRepository.save(enrollment);
  }
}
