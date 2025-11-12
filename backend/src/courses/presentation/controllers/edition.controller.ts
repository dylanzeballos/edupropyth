import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards';
import {
  RolesGuard,
  PermissionsGuard,
} from '../../../auth/infrastructure/guards';
import {
  Roles,
  RequirePermissions,
} from '../../../auth/infrastructure/decorators';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { Permission } from '../../../auth/domain/enums/permissions.enum';
import { CreateEditionFromBlueprintUseCase } from '../../application/use-cases/editions/create-edition-from-blueprint.use-case';
import { UpdateEditionUseCase } from '../../application/use-cases/editions/update-edition.use-case';
import { ChangeEditionStatusUseCase } from '../../application/use-cases/editions/change-edition-status.use-case';
import { ListEditionsByBlueprintUseCase } from '../../application/use-cases/editions/list-editions-by-blueprint.use-case';
import { GetCourseUseCase } from '../../application/use-cases/get-course.use-case';
import { CreateEditionDto } from '../dto/editions/create-edition.dto';
import { UpdateEditionDto } from '../dto/editions/update-edition.dto';
import { ChangeEditionStatusDto } from '../dto/editions/change-edition-status.dto';
import { EditionResponseDto } from '../dto/editions/edition-response.dto';

@ApiTags('Editions')
@ApiBearerAuth()
@Controller('editions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class EditionsController {
  constructor(
    private readonly createEditionUseCase: CreateEditionFromBlueprintUseCase,
    private readonly updateEditionUseCase: UpdateEditionUseCase,
    private readonly changeEditionStatusUseCase: ChangeEditionStatusUseCase,
    private readonly listEditionsByBlueprintUseCase: ListEditionsByBlueprintUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Create an edition from a blueprint' })
  @ApiResponse({ status: 201, type: EditionResponseDto })
  async create(@Body() dto: CreateEditionDto): Promise<EditionResponseDto> {
    const edition = await this.createEditionUseCase.execute(dto);
    const hydrated = await this.getCourseUseCase.execute(edition.id);
    return EditionResponseDto.fromCourse(hydrated);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'List editions, optionally filtered by blueprint' })
  @ApiResponse({ status: 200, type: [EditionResponseDto] })
  async list(
    @Query('blueprintId') blueprintId?: string,
  ): Promise<EditionResponseDto[]> {
    if (blueprintId) {
      const editions =
        await this.listEditionsByBlueprintUseCase.execute(blueprintId);
      return editions.map((edition) => EditionResponseDto.fromCourse(edition));
    }

    const courses = await this.getCourseUseCase.executeAll();
    return courses
      .filter((course) => course.blueprintId)
      .map((course) => EditionResponseDto.fromCourse(course));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Get edition details' })
  @ApiResponse({ status: 200, type: EditionResponseDto })
  async findOne(@Param('id') id: string): Promise<EditionResponseDto> {
    const edition = await this.getCourseUseCase.execute(id);
    return EditionResponseDto.fromCourse(edition);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Update edition (draft only)' })
  @ApiResponse({ status: 200, type: EditionResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEditionDto,
  ): Promise<EditionResponseDto> {
    await this.updateEditionUseCase.execute(id, dto);
    const edition = await this.getCourseUseCase.execute(id);
    return EditionResponseDto.fromCourse(edition);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Change edition status (draft/active)' })
  @ApiResponse({ status: 200, type: EditionResponseDto })
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeEditionStatusDto,
  ): Promise<EditionResponseDto> {
    await this.changeEditionStatusUseCase.execute(id, dto.status);
    const edition = await this.getCourseUseCase.execute(id);
    return EditionResponseDto.fromCourse(edition);
  }
}
