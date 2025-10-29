import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { EditionInstructorRole } from '../entities/edition-instructor.entity';

export class AddEditionInstructorDto {
  @ApiProperty({
    description: 'Identifier of the instructor to assign',
    format: 'uuid',
  })
  @IsUUID()
  instructorId!: string;

  @ApiProperty({
    description: 'Role the instructor will perform within the edition',
    enum: EditionInstructorRole,
  })
  @IsEnum(EditionInstructorRole)
  @IsNotEmpty()
  role!: EditionInstructorRole;
}
