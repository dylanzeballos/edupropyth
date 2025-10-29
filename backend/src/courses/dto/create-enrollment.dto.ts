import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Identifier of the student to enroll',
    format: 'uuid',
  })
  @IsUUID()
  studentId!: string;

  @ApiPropertyOptional({
    description: 'Instructor assigned to mentor the student (optional)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  assignedInstructorId?: string;
}
