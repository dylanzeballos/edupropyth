import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollWithCodeDto {
  @ApiProperty({
    description: 'Enrollment key/code provided by the instructor',
    example: 'MATH101-2024',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentKey: string;
}
