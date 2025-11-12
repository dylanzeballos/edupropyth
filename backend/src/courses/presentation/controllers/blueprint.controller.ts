import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { CreateBlueprintUseCase } from '../../application/use-cases/blueprints/create-blueprint.use-case';
import { UpdateBlueprintUseCase } from '../../application/use-cases/blueprints/update-blueprint.use-case';
import { GetBlueprintUseCase } from '../../application/use-cases/blueprints/get-blueprint.use-case';
import { ListBlueprintsUseCase } from '../../application/use-cases/blueprints/list-blueprints.use-case';
import { ListEditionsByBlueprintUseCase } from '../../application/use-cases/editions/list-editions-by-blueprint.use-case';
import { CreateBlueprintDto } from '../dto/blueprints/create-blueprint.dto';
import { UpdateBlueprintDto } from '../dto/blueprints/update-blueprint.dto';
import { BlueprintResponseDto } from '../dto/blueprints/blueprint-response.dto';
import { EditionResponseDto } from '../dto/editions/edition-response.dto';

@ApiTags('Blueprints')
@ApiBearerAuth()
@Controller('blueprints')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BlueprintsController {
  constructor(
    private readonly createBlueprintUseCase: CreateBlueprintUseCase,
    private readonly updateBlueprintUseCase: UpdateBlueprintUseCase,
    private readonly getBlueprintUseCase: GetBlueprintUseCase,
    private readonly listBlueprintsUseCase: ListBlueprintsUseCase,
    private readonly listEditionsByBlueprintUseCase: ListEditionsByBlueprintUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Create a course blueprint' })
  @ApiResponse({ status: 201, type: BlueprintResponseDto })
  async create(@Body() dto: CreateBlueprintDto): Promise<BlueprintResponseDto> {
    const blueprint = await this.createBlueprintUseCase.execute(dto);
    return BlueprintResponseDto.fromBlueprint(blueprint);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'List course blueprints' })
  @ApiResponse({ status: 200, type: [BlueprintResponseDto] })
  async findAll(): Promise<BlueprintResponseDto[]> {
    const results = await this.listBlueprintsUseCase.execute();
    return results.map((bp) =>
      BlueprintResponseDto.fromBlueprint(
        bp,
        bp.editionsCount,
        bp.draftEditionsCount,
        bp.activeEditionsCount,
        bp.historicEditionsCount,
      ),
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Get blueprint by id' })
  @ApiResponse({ status: 200, type: BlueprintResponseDto })
  async findOne(@Param('id') id: string): Promise<BlueprintResponseDto> {
    const blueprint = await this.getBlueprintUseCase.execute(id);
    return BlueprintResponseDto.fromBlueprint(blueprint);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'Update blueprint' })
  @ApiResponse({ status: 200, type: BlueprintResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlueprintDto,
  ): Promise<BlueprintResponseDto> {
    const blueprint = await this.updateBlueprintUseCase.execute(id, dto);
    return BlueprintResponseDto.fromBlueprint(blueprint);
  }

  @Get(':id/editions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_COURSE_EDITIONS)
  @ApiOperation({ summary: 'List editions for a blueprint' })
  @ApiResponse({ status: 200, type: [EditionResponseDto] })
  async listEditions(
    @Param('id') blueprintId: string,
  ): Promise<EditionResponseDto[]> {
    const editions =
      await this.listEditionsByBlueprintUseCase.execute(blueprintId);
    return editions.map((edition) => EditionResponseDto.fromCourse(edition));
  }
}
