import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CourseAdminGuard } from 'src/courses/infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from 'src/courses/infrastructure/guards/course-editor.guard';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';

import { CreateCourseUseCase } from 'src/courses/application/use-cases/create-course.use-case';
import { GetCourseUseCase } from 'src/courses/application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from 'src/courses/application/use-cases/update-course.use-case';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
  ) {}

  @Post()
  @UseGuards(CourseAdminGuard)
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return await this.createCourseUseCase.execute(createCourseDto, req.user);
  }

  @Get()
  async getCourse() {
    return await this.getCourseUseCase.execute();
  }

  @Patch()
  @UseGuards(CourseEditorGuard)
  async updateCourse(@Body() updateCourseDto: UpdateCourseDto, @Request() req) {
    return await this.updateCourseUseCase.execute(updateCourseDto, req.user);
  }
}
