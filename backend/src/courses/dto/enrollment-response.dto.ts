import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class EnrollmentDto {
  @ApiProperty({ description: 'Enrollment identifier', example: 'a1b...' })
  id!: string;

  @ApiProperty({ description: 'Edition identifier', format: 'uuid' })
  editionId!: string;

  @ApiProperty({ description: 'Student identifier', format: 'uuid' })
  studentId!: string;

  @ApiProperty({
    description: 'Instructor assigned to the student (nullable)',
    format: 'uuid',
    nullable: true,
  })
  assignedInstructorId!: string | null;

  @ApiProperty({ description: 'Enrollment status', enum: EnrollmentStatus })
  status!: EnrollmentStatus;

  @ApiProperty({
    description: 'Date-time when the student enrolled',
    type: String,
  })
  enrolledAt!: string;

  @ApiProperty({
    description: 'Date-time when the student finished the course (nullable)',
    type: String,
    nullable: true,
  })
  completedAt!: string | null;

  @ApiProperty({ description: 'Creation timestamp', type: String })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', type: String })
  updatedAt!: string;

  constructor(partial?: Partial<EnrollmentDto>) {
    Object.assign(this, partial);
  }
}
