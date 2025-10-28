import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseEditionDto } from './create-course-edition.dto';

export class UpdateCourseEditionDto extends PartialType(
  CreateCourseEditionDto,
) {}
