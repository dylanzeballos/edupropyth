import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseEditionDto } from './dto/create-course-edition.dto';
import { UpdateCourseEditionDto } from './dto/update-course-edition.dto';
import { ArchiveCourseEditionDto } from './dto/archive-course-edition.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get()
  findAllCourses() {
    return this.coursesService.findAllCourses();
  }

  @Get(':courseId')
  findCourseById(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.coursesService.findCourseById(courseId);
  }

  @Patch(':courseId')
  updateCourse(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(courseId, dto);
  }

  @Delete(':courseId')
  removeCourse(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.coursesService.removeCourse(courseId);
  }

  @Post(':courseId/editions')
  createEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateCourseEditionDto,
  ) {
    return this.coursesService.createEdition(courseId, dto);
  }

  @Get(':courseId/editions')
  findCourseEditions(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
  ) {
    return this.coursesService.findCourseEditions(courseId);
  }

  @Get(':courseId/editions/:editionId')
  findEditionById(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
  ) {
    return this.coursesService.findEditionById(courseId, editionId);
  }

  @Patch(':courseId/editions/:editionId')
  updateEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Body() dto: UpdateCourseEditionDto,
  ) {
    return this.coursesService.updateEdition(courseId, editionId, dto);
  }

  @Patch(':courseId/editions/:editionId/archive')
  archiveEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Body() dto: ArchiveCourseEditionDto,
  ) {
    return this.coursesService.archiveEdition(courseId, editionId, dto);
  }

  @Delete(':courseId/editions/:editionId')
  removeEdition(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
  ) {
    return this.coursesService.removeEdition(courseId, editionId);
  }
}
