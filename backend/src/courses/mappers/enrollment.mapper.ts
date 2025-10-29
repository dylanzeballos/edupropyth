import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentDto } from '../dto/enrollment-response.dto';

export class EnrollmentMapper {
  static toDto(entity: Enrollment): EnrollmentDto {
    return new EnrollmentDto({
      id: entity.id,
      editionId: entity.editionId,
      studentId: entity.studentId,
      assignedInstructorId: entity.assignedInstructorId ?? null,
      status: entity.status,
      enrolledAt: entity.enrolledAt.toISOString(),
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }
}
