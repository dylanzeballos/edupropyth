import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import {
  CourseEdition,
  CourseEditionStatus,
} from './entities/course-edition.entity';
import { EditionInstructor } from './entities/edition-instructor.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEditionDto } from './dto/create-course-edition.dto';
import { UpdateCourseEditionDto } from './dto/update-course-edition.dto';
import { ListCoursesQueryDto } from './dto/list-courses.query.dto';
import { ListCourseEditionsQueryDto } from './dto/list-course-editions.query.dto';
import {
  CourseDetailDto,
  CourseEditionDto,
  CourseSummaryDto,
  PaginatedCoursesResponseDto,
  PaginatedCourseEditionsResponseDto,
  PaginationMetaDto,
} from './dto/course-response.dto';
import { CourseMapper } from './mappers/course.mapper';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseEdition)
    private readonly editionRepository: Repository<CourseEdition>,
    @InjectRepository(EditionInstructor)
    private readonly editionInstructorRepository: Repository<EditionInstructor>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async createCourse(dto: CreateCourseDto): Promise<CourseSummaryDto> {
    await this.ensureCourseUniqueness(dto.code, dto.slug);

    const course = this.courseRepository.create({
      code: dto.code.trim(),
      name: dto.name.trim(),
      slug: dto.slug ? dto.slug.trim().toLowerCase() : null,
      description: dto.description,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.courseRepository.save(course);
    const persisted = await this.courseRepository.findOneOrFail({
      where: { id: saved.id },
    });

    return CourseMapper.toSummary({ ...persisted, editionsCount: 0 });
  }

  async findAllCourses(
    query: ListCoursesQueryDto,
  ): Promise<PaginatedCoursesResponseDto> {
    const qb = this.courseRepository
      .createQueryBuilder('course')
      .loadRelationCountAndMap('course.editionsCount', 'course.editions');

    if (query.search) {
      qb.andWhere(
        '(course.name ILIKE :search OR course.code ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    if (query.isActive !== undefined) {
      qb.andWhere('course.is_active = :isActive', {
        isActive: query.isActive,
      });
    }

    const total = await qb.getCount();

    const items = await qb
      .orderBy(`course.${query.sortBy}`, query.sortDirection.toUpperCase() as
        | 'ASC'
        | 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return new PaginatedCoursesResponseDto({
      data: items.map((course) =>
        CourseMapper.toSummary(course as Course & { editionsCount: number }),
      ),
      meta: new PaginationMetaDto({
        total,
        page: query.page,
        limit: query.limit,
        lastPage: Math.ceil(total / query.limit) || 1,
      }),
    });
  }

  async findCourseById(id: string): Promise<CourseDetailDto> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    const editions = await this.editionRepository.find({
      where: { courseId: id },
      order: { createdAt: 'DESC' },
    });

    return CourseMapper.toDetail(
      { ...course, editionsCount: editions.length },
      editions,
    );
  }

  async updateCourse(
    id: string,
    dto: UpdateCourseDto,
  ): Promise<CourseSummaryDto> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (dto.code && dto.code !== course.code) {
      await this.ensureCourseUniqueness(dto.code, undefined);
    }

    if (dto.slug && dto.slug !== course.slug) {
      await this.ensureCourseUniqueness(undefined, dto.slug);
    }

    const { slug, ...rest } = dto;
    Object.assign(course, rest);
    if (slug !== undefined) {
      course.slug = slug ? slug.trim().toLowerCase() : null;
    }

    const updated = await this.courseRepository.save(course);
    const editionsCount = await this.editionRepository.count({
      where: { courseId: updated.id },
    });

    return CourseMapper.toSummary({
      ...updated,
      editionsCount,
    });
  }

  async removeCourse(id: string): Promise<void> {
    const editionsCount = await this.editionRepository.count({
      where: { courseId: id },
    });

    if (editionsCount > 0) {
      throw new ConflictException(
        'No se puede eliminar un curso con ediciones registradas',
      );
    }

    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Curso no encontrado');
    }
  }

  async createEdition(
    courseId: string,
    dto: CreateCourseEditionDto,
  ): Promise<CourseEditionDto> {
    await this.ensureCourseExists(courseId);
    const label = dto.label.trim();
    await this.ensureEditionLabelUniqueness(courseId, label);
    this.ensureValidDateRange(dto.startDate, dto.endDate);

    const edition = this.editionRepository.create({
      courseId,
      label,
      term: this.normalizeOptionalString(dto.term),
      year: dto.year,
      status: dto.status ?? CourseEditionStatus.DRAFT,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });

    const saved = await this.editionRepository.save(edition);
    const persisted = await this.editionRepository.findOneOrFail({
      where: { id: saved.id },
    });
    return CourseMapper.toEditionDto(persisted);
  }

  async findCourseEditions(
    courseId: string,
    query: ListCourseEditionsQueryDto,
  ): Promise<PaginatedCourseEditionsResponseDto> {
    await this.ensureCourseExists(courseId);
    const qb = this.editionRepository
      .createQueryBuilder('edition')
      .where('edition.course_id = :courseId', { courseId });

    if (query.status) {
      qb.andWhere('edition.status = :status', { status: query.status });
    }

    const total = await qb.getCount();

    const items = await qb
      .orderBy(
        `edition.${query.sortBy}`,
        query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return new PaginatedCourseEditionsResponseDto({
      data: items.map(CourseMapper.toEditionDto),
      meta: new PaginationMetaDto({
        total,
        page: query.page,
        limit: query.limit,
        lastPage: Math.ceil(total / query.limit) || 1,
      }),
    });
  }

  async findEditionById(
    courseId: string,
    editionId: string,
  ): Promise<CourseEditionDto> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId, courseId },
    });

    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }

    return CourseMapper.toEditionDto(edition);
  }

  async updateEdition(
    courseId: string,
    editionId: string,
    dto: UpdateCourseEditionDto,
  ): Promise<CourseEditionDto> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId, courseId },
    });
    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }

    if (dto.label !== undefined) {
      const label = dto.label.trim();
      if (label && label !== edition.label) {
        await this.ensureEditionLabelUniqueness(courseId, label);
        edition.label = label;
      }
    }

    const { startDate, endDate, ...rest } = dto;

    if (startDate !== undefined) {
      edition.startDate = startDate ? new Date(startDate) : null;
    }

    if (endDate !== undefined) {
      edition.endDate = endDate ? new Date(endDate) : null;
    }

    this.ensureValidDateRange(
      edition.startDate?.toISOString() ?? null,
      edition.endDate?.toISOString() ?? null,
    );

    Object.assign(edition, {
      ...rest,
      term:
        rest.term !== undefined
          ? this.normalizeOptionalString(rest.term)
          : edition.term,
    });
    const saved = await this.editionRepository.save(edition);
    return CourseMapper.toEditionDto(saved);
  }

  async archiveEdition(
    courseId: string,
    editionId: string,
    archivedByUserId: string | null,
  ): Promise<CourseEditionDto> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId, courseId },
    });
    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }

    if (edition.status === CourseEditionStatus.ARCHIVED) {
      return CourseMapper.toEditionDto(edition);
    }

    edition.status = CourseEditionStatus.ARCHIVED;
    edition.archivedAt = new Date();
    edition.archivedByUserId = archivedByUserId;

    const saved = await this.editionRepository.save(edition);
    return CourseMapper.toEditionDto(saved);
  }

  async removeEdition(courseId: string, editionId: string): Promise<void> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId, courseId },
    });
    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }

    const instructorAssignments =
      await this.editionInstructorRepository.count({
        where: { editionId },
      });
    if (instructorAssignments > 0) {
      throw new ConflictException(
        'No se puede eliminar una edición con docentes asignados',
      );
    }

    const enrollments = await this.enrollmentRepository.count({
      where: { editionId },
    });
    if (enrollments > 0) {
      throw new ConflictException(
        'No se puede eliminar una edición con estudiantes inscritos',
      );
    }

    await this.editionRepository.delete(editionId);
  }

  private async ensureCourseExists(courseId: string): Promise<void> {
    const exists = await this.courseRepository.exist({ where: { id: courseId } });
    if (!exists) {
      throw new NotFoundException('Curso no encontrado');
    }
  }

  private async ensureCourseUniqueness(
    code?: string,
    slug?: string,
  ): Promise<void> {
    if (!code && !slug) return;

    const normalizedSlug = slug ? slug.trim().toLowerCase() : undefined;

    const whereConditions: FindOptionsWhere<Course>[] = [];
    if (code) {
      whereConditions.push({ code });
    }
    if (normalizedSlug) {
      whereConditions.push({ slug: normalizedSlug });
    }

    if (whereConditions.length === 0) {
      return;
    }

    const exists = await this.courseRepository.findOne({
      where: whereConditions,
    });

    if (exists) {
      throw new ConflictException('Ya existe un curso con los datos enviados');
    }
  }

  private async ensureEditionLabelUniqueness(
    courseId: string,
    label: string,
  ): Promise<void> {
    const exists = await this.editionRepository.findOne({
      where: { courseId, label },
    });

    if (exists) {
      throw new ConflictException(
        'Ya existe una edición con el mismo identificador para este curso',
      );
    }
  }

  private normalizeOptionalString(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private ensureValidDateRange(
    startDate?: string | null,
    endDate?: string | null,
  ): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new BadRequestException(
          'Las fechas de inicio y fin no tienen un formato válido',
        );
      }
      if (start > end) {
        throw new BadRequestException(
          'La fecha de inicio no puede ser posterior a la fecha de fin',
        );
      }
    }
  }
}
