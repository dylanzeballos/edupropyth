import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({
    description: 'Group name',
    example: 'Grupo A - Turno Mañana',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Group schedule',
    example: 'Lunes, Miércoles y Viernes 08:00-10:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiProperty({
    description: 'Instructor ID for the group',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUUID()
  instructorId?: string | null;

  @ApiProperty({
    description: 'Maximum number of students allowed',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @ApiProperty({
    description: 'Enrollment key/code for students to self-enroll',
    example: 'MATH2024A',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  enrollmentKey?: string;

  @ApiProperty({
    description: 'Whether enrollment is currently open',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEnrollmentOpen?: boolean;

  @ApiProperty({
    description: 'Date when enrollment period starts',
    example: '2024-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @ApiProperty({
    description: 'Date when enrollment period ends',
    example: '2024-03-15T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;

  @ApiProperty({
    description: 'Whether the group is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
