import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards';
import { CourseAdminGuard } from '../../infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from '../../infrastructure/guards/course-editor.guard';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

import { CreateCourseUseCase } from '../../application/use-cases/create-course.use-case';
import { GetCourseUseCase } from '../../application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.use-case';
import { User } from '../../../auth/domain/entities/user.entity';

interface RequestWithUser {
  user: User;
}

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
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.createCourseUseCase.execute(createCourseDto, req.user);
  }

  @Get()
  async getCourse() {
    return await this.getCourseUseCase.execute();
  }

  @Patch()
  @UseGuards(CourseEditorGuard)
  async updateCourse(
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.updateCourseUseCase.execute(updateCourseDto, req.user);
  }
}
