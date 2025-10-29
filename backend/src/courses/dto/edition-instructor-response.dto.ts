import { ApiProperty } from '@nestjs/swagger';
import { EditionInstructorRole } from '../entities/edition-instructor.entity';

export class EditionInstructorDto {
  @ApiProperty({ description: 'Assignment identifier', example: 'f2c...' })
  id!: string;

  @ApiProperty({ description: 'Edition identifier', format: 'uuid' })
  editionId!: string;

  @ApiProperty({ description: 'Instructor identifier', format: 'uuid' })
  instructorId!: string;

  @ApiProperty({
    description: 'Role performed by the instructor within the edition',
    enum: EditionInstructorRole,
  })
  role!: EditionInstructorRole;

  @ApiProperty({
    description: 'Timestamp when instructor was assigned',
    type: String,
  })
  assignedAt!: string;

  @ApiProperty({
    description: 'Timestamp when instructor was unassigned (null if active)',
    type: String,
    nullable: true,
  })
  unassignedAt!: string | null;

  @ApiProperty({ description: 'Creation timestamp', type: String })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', type: String })
  updatedAt!: string;

  constructor(partial?: Partial<EditionInstructorDto>) {
    Object.assign(this, partial);
  }
}
