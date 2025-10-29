import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CourseEdition,
  CourseEditionStatus,
} from '../entities/course-edition.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentDto } from '../dto/enrollment-response.dto';
import { EnrollmentMapper } from '../mappers/enrollment.mapper';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { EditionInstructorsService } from './edition-instructors.service';
import {
  PaginatedEnrollmentsResponseDto,
  PaginationMetaDto,
} from '../dto/course-response.dto';
import { ListEnrollmentsQueryDto } from '../dto/list-enrollments.query.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(CourseEdition)
    private readonly editionRepository: Repository<CourseEdition>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly editionInstructorsService: EditionInstructorsService,
  ) {}

  async createEnrollment(
    editionId: string,
    dto: CreateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    const edition = await this.getEditionOrThrow(editionId);
    this.ensureEditionIsMutable(edition, 'inscribir estudiantes');

    const student = await this.userRepository.findOne({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (student.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Un usuario administrador no puede ser inscrito como estudiante',
      );
    }

    const existing = await this.enrollmentRepository.findOne({
      where: { editionId, studentId: dto.studentId },
    });
    if (existing) {
      throw new ConflictException('El estudiante ya está inscrito en la edición');
    }

    if (dto.assignedInstructorId) {
      await this.editionInstructorsService.ensureInstructorActive(
        editionId,
        dto.assignedInstructorId,
      );
    }

    const enrollment = this.enrollmentRepository.create({
      editionId,
      studentId: dto.studentId,
      assignedInstructorId: dto.assignedInstructorId ?? null,
    });

    const saved = await this.enrollmentRepository.save(enrollment);
    return EnrollmentMapper.toDto(saved);
  }

  async listEnrollments(
    editionId: string,
    query: ListEnrollmentsQueryDto,
  ): Promise<PaginatedEnrollmentsResponseDto> {
    await this.ensureEditionExists(editionId);

    const qb = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.edition_id = :editionId', { editionId });

    if (query.status) {
      qb.andWhere('enrollment.status = :status', { status: query.status });
    }

    const total = await qb.getCount();

    const items = await qb
      .orderBy('enrollment.enrolled_at', 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return new PaginatedEnrollmentsResponseDto({
      data: items.map(EnrollmentMapper.toDto),
      meta: new PaginationMetaDto({
        total,
        page: query.page,
        limit: query.limit,
        lastPage: Math.ceil(total / query.limit) || 1,
      }),
    });
  }

  async updateEnrollment(
    enrollmentId: string,
    dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });
    if (!enrollment) {
      throw new NotFoundException('Inscripción no encontrada');
    }
    const edition = await this.getEditionOrThrow(enrollment.editionId);
    this.ensureEditionIsMutable(edition, 'actualizar inscripciones');

    if (dto.assignedInstructorId !== undefined) {
      if (dto.assignedInstructorId === null) {
        enrollment.assignedInstructorId = null;
      } else {
        await this.editionInstructorsService.ensureInstructorActive(
          enrollment.editionId,
          dto.assignedInstructorId,
        );
        enrollment.assignedInstructorId = dto.assignedInstructorId;
      }
    }

    if (dto.status !== undefined) {
      enrollment.status = dto.status;
      if (dto.status === EnrollmentStatus.COMPLETED) {
        enrollment.completedAt = new Date();
      } else {
        enrollment.completedAt = null;
      }
    }

    const saved = await this.enrollmentRepository.save(enrollment);
    return EnrollmentMapper.toDto(saved);
  }

  async removeEnrollment(enrollmentId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });
    if (!enrollment) {
      throw new NotFoundException('Inscripción no encontrada');
    }
    const edition = await this.getEditionOrThrow(enrollment.editionId);
    this.ensureEditionIsMutable(edition, 'eliminar inscripciones');

    await this.enrollmentRepository.delete(enrollmentId);
  }

  private async ensureEditionExists(editionId: string): Promise<void> {
    const exists = await this.editionRepository.exist({ where: { id: editionId } });
    if (!exists) {
      throw new NotFoundException('Edición no encontrada');
    }
  }

  private async getEditionOrThrow(editionId: string): Promise<CourseEdition> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId },
    });
    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }
    return edition;
  }

  private ensureEditionIsMutable(edition: CourseEdition, action: string): void {
    if (edition.status === CourseEditionStatus.ARCHIVED) {
      throw new ConflictException(
        `La edición está archivada, no se pueden ${action}`,
      );
    }
  }
}
