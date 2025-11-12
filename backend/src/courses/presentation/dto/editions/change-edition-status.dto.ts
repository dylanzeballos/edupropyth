import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

export class ChangeEditionStatusDto {
  @ApiProperty({
    enum: [CourseStatus.DRAFT, CourseStatus.ACTIVE, CourseStatus.HISTORIC],
  })
  @IsIn([CourseStatus.DRAFT, CourseStatus.ACTIVE, CourseStatus.HISTORIC])
  status: CourseStatus;
}
