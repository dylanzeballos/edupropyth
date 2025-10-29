import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateEditionInstructorDto {
  @ApiPropertyOptional({
    description:
      'Timestamp (ISO 8601) when the instructor was unassigned. Set to null or omit to keep active.',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  unassignedAt?: string | null;
}
