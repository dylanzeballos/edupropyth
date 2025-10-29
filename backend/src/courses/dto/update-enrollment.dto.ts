import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({
    description: 'New enrollment status',
    enum: EnrollmentStatus,
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional({
    description: 'Instructor assigned to the student',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assignedInstructorId?: string | null;
}
