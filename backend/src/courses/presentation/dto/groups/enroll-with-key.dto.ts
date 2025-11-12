import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollWithKeyDto {
  @ApiProperty({
    description: 'UUID of the group to enroll in',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    description: 'Enrollment key/code provided by the instructor',
    example: 'MATH101-2024',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentKey: string;
}
