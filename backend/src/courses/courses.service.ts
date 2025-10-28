import {
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
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEditionDto } from './dto/create-course-edition.dto';
import { UpdateCourseEditionDto } from './dto/update-course-edition.dto';
import { ArchiveCourseEditionDto } from './dto/archive-course-edition.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseEdition)
    private readonly editionRepository: Repository<CourseEdition>,
  ) {}

  async createCourse(dto: CreateCourseDto): Promise<Course> {
    await this.ensureCourseUniqueness(dto.code, dto.slug);

    const course = this.courseRepository.create({
      code: dto.code.trim(),
      name: dto.name.trim(),
      slug: dto.slug ? dto.slug.trim().toLowerCase() : null,
      description: dto.description,
      isActive: dto.isActive ?? true,
    });

    return await this.courseRepository.save(course);
  }

  async findAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['editions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCourseById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['editions'],
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    return course;
  }

  async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
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

    return await this.courseRepository.save(course);
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
  ): Promise<CourseEdition> {
    await this.ensureCourseExists(courseId);
    await this.ensureEditionLabelUniqueness(courseId, dto.label);

    const edition = this.editionRepository.create({
      courseId,
      label: dto.label,
      term: dto.term,
      year: dto.year,
      status: dto.status ?? CourseEditionStatus.DRAFT,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });

    return await this.editionRepository.save(edition);
  }

  async findCourseEditions(courseId: string): Promise<CourseEdition[]> {
    await this.ensureCourseExists(courseId);
    return await this.editionRepository.find({
      where: { courseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findEditionById(
    courseId: string,
    editionId: string,
  ): Promise<CourseEdition> {
    const edition = await this.editionRepository.findOne({
      where: { id: editionId, courseId },
    });

    if (!edition) {
      throw new NotFoundException('Edición no encontrada');
    }

    return edition;
  }

  async updateEdition(
    courseId: string,
    editionId: string,
    dto: UpdateCourseEditionDto,
  ): Promise<CourseEdition> {
    const edition = await this.findEditionById(courseId, editionId);

    if (dto.label && dto.label !== edition.label) {
      await this.ensureEditionLabelUniqueness(courseId, dto.label);
    }

    const { startDate, endDate, ...rest } = dto;

    if (startDate !== undefined) {
      edition.startDate = startDate ? new Date(startDate) : null;
    }

    if (endDate !== undefined) {
      edition.endDate = endDate ? new Date(endDate) : null;
    }

    Object.assign(edition, rest);
    return await this.editionRepository.save(edition);
  }

  async archiveEdition(
    courseId: string,
    editionId: string,
    dto: ArchiveCourseEditionDto,
  ): Promise<CourseEdition> {
    const edition = await this.findEditionById(courseId, editionId);
    if (edition.status === CourseEditionStatus.ARCHIVED) {
      return edition;
    }

    edition.status = CourseEditionStatus.ARCHIVED;
    edition.archivedAt = new Date();
    edition.archivedByUserId = dto.archivedByUserId ?? null;

    return await this.editionRepository.save(edition);
  }

  async removeEdition(courseId: string, editionId: string): Promise<void> {
    await this.findEditionById(courseId, editionId);
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
}
