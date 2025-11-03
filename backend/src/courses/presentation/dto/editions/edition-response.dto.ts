import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from '../course-response.dto';
import { Course } from '../../../domain/entities/course.entity';

export class EditionResponseDto extends CourseResponseDto {
  @ApiProperty({ required: false })
  blueprintId?: string;

  constructor(course: Course | CourseResponseDto) {
    super(course as Course);
    this.blueprintId =
      (course as Course).blueprintId ??
      (course as CourseResponseDto).blueprintId;
  }

  static fromCourse(course: Course | CourseResponseDto): EditionResponseDto {
    return new EditionResponseDto(course);
  }
}
