import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CourseEdition, CourseEditionStatus } from '../entities/course-edition.entity';
import { EditionInstructor } from '../entities/edition-instructor.entity';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { AddEditionInstructorDto } from '../dto/add-edition-instructor.dto';
import { EditionInstructorDto } from '../dto/edition-instructor-response.dto';
import { EditionInstructorMapper } from '../mappers/edition-instructor.mapper';
import { UpdateEditionInstructorDto } from '../dto/update-edition-instructor.dto';

@Injectable()
export class EditionInstructorsService {
  constructor(
    @InjectRepository(CourseEdition)
    private readonly editionRepository: Repository<CourseEdition>,
    @InjectRepository(EditionInstructor)
    private readonly instructorRepository: Repository<EditionInstructor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addInstructor(
    editionId: string,
    dto: AddEditionInstructorDto,
  ): Promise<EditionInstructorDto> {
    const edition = await this.getEditionOrThrow(editionId);
    this.ensureEditionIsMutable(edition, 'assign instructors');

    const instructor = await this.userRepository.findOne({
      where: { id: dto.instructorId },
    });
    if (!instructor) {
      throw new NotFoundException('Instructor no encontrado');
    }
    if (instructor.role === UserRole.STUDENT) {
      throw new BadRequestException(
        'Solo se pueden asignar instructores con rol docente o superior',
      );
    }

    let assignment = await this.instructorRepository.findOne({
      where: {
        editionId,
        instructorId: dto.instructorId,
        role: dto.role,
      },
    });

    if (assignment) {
      if (assignment.unassignedAt === null) {
        throw new ConflictException('El instructor ya está asignado a la edición con ese rol');
      }
      assignment.unassignedAt = null;
      assignment.assignedAt = new Date();
    } else {
      assignment = this.instructorRepository.create({
        editionId,
        instructorId: dto.instructorId,
        role: dto.role,
      });
    }

    const saved = await this.instructorRepository.save(assignment);
    return EditionInstructorMapper.toDto(saved);
  }

  async listInstructors(editionId: string): Promise<EditionInstructorDto[]> {
    await this.ensureEditionExists(editionId);
    const assignments = await this.instructorRepository.find({
      where: { editionId },
      order: { assignedAt: 'ASC' },
    });
    return assignments.map(EditionInstructorMapper.toDto);
  }

  async updateInstructor(
    editionId: string,
    instructorId: string,
    dto: UpdateEditionInstructorDto,
  ): Promise<EditionInstructorDto> {
    const edition = await this.getEditionOrThrow(editionId);
    this.ensureEditionIsMutable(edition, 'actualizar instructores');

    const assignment = await this.instructorRepository.findOne({
      where: {
        editionId,
        instructorId,
        unassignedAt: IsNull(),
      },
    });

    if (!assignment) {
      throw new NotFoundException('Asignación activa no encontrada para el instructor');
    }

    if (dto.unassignedAt !== undefined) {
      if (dto.unassignedAt === null) {
        assignment.unassignedAt = null;
      } else {
        assignment.unassignedAt = new Date(dto.unassignedAt);
        if (Number.isNaN(assignment.unassignedAt.getTime())) {
          throw new BadRequestException('La fecha de baja es inválida');
        }
      }
    }

    const saved = await this.instructorRepository.save(assignment);
    return EditionInstructorMapper.toDto(saved);
  }

  async removeInstructor(editionId: string, instructorId: string): Promise<void> {
    const edition = await this.getEditionOrThrow(editionId);
    this.ensureEditionIsMutable(edition, 'eliminar instructores');

    let assignment = await this.instructorRepository.findOne({
      where: { editionId, instructorId, unassignedAt: IsNull() },
    });
    if (!assignment) {
      assignment = await this.instructorRepository.findOne({
        where: { editionId, instructorId },
        order: { assignedAt: 'DESC' },
      });
    }
    if (!assignment) {
      throw new NotFoundException('Asignación de instructor no encontrada');
    }

    await this.instructorRepository.delete(assignment.id);
  }

  async ensureInstructorActive(editionId: string, instructorId: string): Promise<void> {
    const assignment = await this.instructorRepository.findOne({
      where: {
        editionId,
        instructorId,
        unassignedAt: IsNull(),
      },
    });
    if (!assignment) {
      throw new ForbiddenException(
        'El instructor asignado no está activo en la edición',
      );
    }
  }

  private async ensureEditionExists(editionId: string): Promise<void> {
    const exists = await this.editionRepository.exist({ where: { id: editionId } });
    if (!exists) {
      throw new NotFoundException('Edición no encontrada');
    }
  }

  private async getEditionOrThrow(editionId: string): Promise<CourseEdition> {
    const edition = await this.editionRepository.findOne({ where: { id: editionId } });
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
