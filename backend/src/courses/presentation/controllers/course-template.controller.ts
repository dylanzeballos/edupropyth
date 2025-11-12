import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CreateCourseTemplateUseCase } from '../../application/use-cases/course-templates/create-course-template.use-case';
import { CreateDefaultCourseTemplateUseCase } from '../../application/use-cases/course-templates/create-default-course-template.use-case';
import { GetCourseTemplateUseCase } from '../../application/use-cases/course-templates/get-course-template.use-case';
import { UpdateCourseTemplateUseCase } from '../../application/use-cases/course-templates/update-course-template.use-case';
import { DeleteCourseTemplateUseCase } from '../../application/use-cases/course-templates/delete-course-template.use-case';
import { CreateCourseTemplateDto } from '../dto/course-templates/create-course-template.dto';
import { UpdateCourseTemplateDto } from '../dto/course-templates/update-course-template.dto';
import { CourseTemplateResponseDto } from '../dto/course-templates/course-template-response.dto';

@ApiTags('Course Templates')
@ApiBearerAuth()
@Controller('course-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseTemplateController {
  constructor(
    private readonly createCourseTemplateUseCase: CreateCourseTemplateUseCase,
    private readonly createDefaultCourseTemplateUseCase: CreateDefaultCourseTemplateUseCase,
    private readonly getCourseTemplateUseCase: GetCourseTemplateUseCase,
    private readonly updateCourseTemplateUseCase: UpdateCourseTemplateUseCase,
    private readonly deleteCourseTemplateUseCase: DeleteCourseTemplateUseCase,
  ) {}

  @Post('default/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @ApiOperation({ summary: 'Create default course template' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 201,
    description: 'Default template created successfully',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async createDefault(
    @Param('courseId') courseId: string,
    @CurrentUser('id') userId: string,
  ): Promise<CourseTemplateResponseDto> {
    const template = await this.createDefaultCourseTemplateUseCase.execute(
      courseId,
      userId,
    );
    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @ApiOperation({ summary: 'Create a new course template' })
  @ApiResponse({
    status: 201,
    description: 'Course template created successfully',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Template already exists' })
  async create(
    @Body() dto: CreateCourseTemplateDto,
    @CurrentUser('id') userId: string,
  ): Promise<CourseTemplateResponseDto> {
    const template = await this.createCourseTemplateUseCase.execute(
      dto,
      userId,
    );
    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course template by ID' })
  @ApiParam({ name: 'id', description: 'Course template ID' })
  @ApiResponse({
    status: 200,
    description: 'Course template found',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course template not found' })
  async getById(@Param('id') id: string): Promise<CourseTemplateResponseDto> {
    const template = await this.getCourseTemplateUseCase.executeById(id);
    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get course template by course ID (creates default if not exists)',
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course template found or created',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getByCourseId(
    @Param('courseId') courseId: string,
    @CurrentUser('id') userId: string,
  ): Promise<CourseTemplateResponseDto> {
    let template =
      await this.getCourseTemplateUseCase.executeByCourseId(courseId);

    if (!template) {
      template = await this.createDefaultCourseTemplateUseCase.execute(
        courseId,
        userId,
      );
    }

    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @ApiOperation({ summary: 'Update course template by ID' })
  @ApiParam({ name: 'id', description: 'Course template ID' })
  @ApiResponse({
    status: 200,
    description: 'Course template updated successfully',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course template not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseTemplateDto,
    @CurrentUser('id') userId: string,
  ): Promise<CourseTemplateResponseDto> {
    const template = await this.updateCourseTemplateUseCase.execute(
      id,
      dto,
      userId,
    );
    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Put('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @ApiOperation({ summary: 'Update course template by course ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course template updated successfully',
    type: CourseTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course template not found' })
  async updateByCourseId(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseTemplateDto,
    @CurrentUser('id') userId: string,
  ): Promise<CourseTemplateResponseDto> {
    const template = await this.updateCourseTemplateUseCase.executeByCourseId(
      courseId,
      dto,
      userId,
    );
    return CourseTemplateResponseDto.fromEntity(template);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete course template by ID' })
  @ApiParam({ name: 'id', description: 'Course template ID' })
  @ApiResponse({
    status: 204,
    description: 'Course template deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Course template not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCourseTemplateUseCase.execute(id);
  }

  @Delete('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete course template by course ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 204,
    description: 'Course template deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Course template not found' })
  async deleteByCourseId(@Param('courseId') courseId: string): Promise<void> {
    await this.deleteCourseTemplateUseCase.executeByCourseId(courseId);
  }
}
