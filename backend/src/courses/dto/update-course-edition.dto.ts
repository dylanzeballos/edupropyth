import { PartialType } from '@nestjs/swagger';
import { CreateCourseEditionDto } from './create-course-edition.dto';

export class UpdateCourseEditionDto extends PartialType(
  CreateCourseEditionDto,
) {}
