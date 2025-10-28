import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEditionDto } from './dto/create-course-edition.dto';
import { UpdateCourseEditionDto } from './dto/update-course-edition.dto';
import { ListCoursesQueryDto } from './dto/list-courses.query.dto';
import { ListCourseEditionsQueryDto } from './dto/list-course-editions.query.dto';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/infrastructure/guards/roles.guard';
import { Roles } from '../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../auth/domain/entities/user.entity';
import { CurrentUser } from '../auth/infrastructure/decorators/current-user.decorator';
import { User } from '../auth/domain/entities/user.entity';
import {
  CourseDetailDto,
  CourseEditionDto,
  CourseSummaryDto,
  PaginatedCourseEditionsResponseDto,
  PaginatedCoursesResponseDto,
} from './dto/course-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CourseSummaryDto })
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedCoursesResponseDto })
  findAllCourses(@Query() query: ListCoursesQueryDto) {
    return this.coursesService.findAllCourses(query);
  }

  @Get(':courseId')
  @ApiOkResponse({ type: CourseDetailDto })
  findCourseById(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.coursesService.findCourseById(courseId);
  }

  @Patch(':courseId')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: CourseSummaryDto })
  updateCourse(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(courseId, dto);
  }

  @Delete(':courseId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Course deleted successfully' })
  removeCourse(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.coursesService.removeCourse(courseId);
  }

  @Post(':courseId/editions')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CourseEditionDto })
  createEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateCourseEditionDto,
  ) {
    return this.coursesService.createEdition(courseId, dto);
  }

  @Get(':courseId/editions')
  @ApiOkResponse({ type: PaginatedCourseEditionsResponseDto })
  findCourseEditions(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Query() query: ListCourseEditionsQueryDto,
  ) {
    return this.coursesService.findCourseEditions(courseId, query);
  }

  @Get(':courseId/editions/:editionId')
  @ApiOkResponse({ type: CourseEditionDto })
  findEditionById(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
  ) {
    return this.coursesService.findEditionById(courseId, editionId);
  }

  @Patch(':courseId/editions/:editionId')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: CourseEditionDto })
  updateEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Body() dto: UpdateCourseEditionDto,
  ) {
    return this.coursesService.updateEdition(courseId, editionId, dto);
  }

  @Patch(':courseId/editions/:editionId/archive')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: CourseEditionDto })
  archiveEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.archiveEdition(
      courseId,
      editionId,
      user?.id ?? null,
    );
  }

  @Delete(':courseId/editions/:editionId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Edition deleted successfully' })
  removeEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
  ) {
    return this.coursesService.removeEdition(courseId, editionId);
  }
}
