import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards';
import { CourseAdminGuard } from '../../infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from '../../infrastructure/guards/course-editor.guard';
import { CourseStatusGuard } from '../../infrastructure/guards/course-status.guard';
import { AllowedCourseStatuses } from '../../infrastructure/decorators/allowed-course-statuses.decorator';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CourseResponseDto } from '../dto/course-response.dto';

import { CreateCourseUseCase } from '../../application/use-cases/create-course.use-case';
import { GetCourseUseCase } from '../../application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.use-case';
import { User } from '../../../auth/domain/entities/user.entity';

interface RequestWithUser {
  user: User;
}

@ApiTags('Courses')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Course created',
    type: CourseResponseDto,
  })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Request() req: RequestWithUser,
  ): Promise<CourseResponseDto> {
    return await this.createCourseUseCase.execute(createCourseDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'List of courses',
    type: [CourseResponseDto],
  })
  async getAllCourses(): Promise<CourseResponseDto[]> {
    return await this.getCourseUseCase.executeAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({
    status: 200,
    description: 'Course found',
    type: CourseResponseDto,
  })
  async getCourseById(@Param('id') id: string): Promise<CourseResponseDto> {
    return await this.getCourseUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(CourseEditorGuard, CourseStatusGuard)
  @AllowedCourseStatuses(CourseStatus.DRAFT, CourseStatus.ACTIVE)
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({
    status: 200,
    description: 'Course updated',
    type: CourseResponseDto,
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req: RequestWithUser,
  ): Promise<CourseResponseDto> {
    return await this.updateCourseUseCase.execute(
      id,
      updateCourseDto,
      req.user,
    );
  }
}
