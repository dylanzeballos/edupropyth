import { EditionInstructor } from '../entities/edition-instructor.entity';
import { EditionInstructorDto } from '../dto/edition-instructor-response.dto';

export class EditionInstructorMapper {
  static toDto(entity: EditionInstructor): EditionInstructorDto {
    return new EditionInstructorDto({
      id: entity.id,
      editionId: entity.editionId,
      instructorId: entity.instructorId,
      role: entity.role,
      assignedAt: entity.assignedAt.toISOString(),
      unassignedAt: entity.unassignedAt
        ? entity.unassignedAt.toISOString()
        : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }
}
