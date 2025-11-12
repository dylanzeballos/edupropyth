import {
  Body,
  Controller,
  Delete,
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
import { GroupEditorGuard } from '../../infrastructure/guards/group-editor.guard';
import {
  Roles,
  RequirePermissions,
} from '../../../auth/infrastructure/decorators';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { Permission } from '../../../auth/domain/enums/permissions.enum';
import { CreateGroupUseCase } from '../../application/use-cases/groups/create-group.use-case';
import { UpdateGroupUseCase } from '../../application/use-cases/groups/update-group.use-case';
import { DeleteGroupUseCase } from '../../application/use-cases/groups/delete-group.use-case';
import { ListGroupsByEditionUseCase } from '../../application/use-cases/groups/list-groups-by-edition.use-case';
import { AssignGroupInstructorUseCase } from '../../application/use-cases/groups/assign-group-instructor.use-case';
import { EnrollStudentsUseCase } from '../../application/use-cases/groups/enroll-students.use-case';
import { RemoveEnrollmentUseCase } from '../../application/use-cases/groups/remove-enrollment.use-case';
import { GetGroupUseCase } from '../../application/use-cases/groups/get-group.use-case';
import { CreateGroupDto } from '../dto/groups/create-group.dto';
import { UpdateGroupDto } from '../dto/groups/update-group.dto';
import { AssignGroupInstructorDto } from '../dto/groups/assign-group-instructor.dto';
import { EnrollStudentsDto } from '../dto/groups/enroll-students.dto';
import { GroupResponseDto } from '../dto/groups/group-response.dto';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('editions/:editionId/groups')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class GroupsController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
    private readonly listGroupsByEditionUseCase: ListGroupsByEditionUseCase,
    private readonly assignGroupInstructorUseCase: AssignGroupInstructorUseCase,
    private readonly enrollStudentsUseCase: EnrollStudentsUseCase,
    private readonly removeEnrollmentUseCase: RemoveEnrollmentUseCase,
    private readonly getGroupUseCase: GetGroupUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.MANAGE_GROUPS)
  @ApiOperation({ summary: 'List groups for an edition' })
  @ApiResponse({ status: 200, type: [GroupResponseDto] })
  async list(
    @Param('editionId') editionId: string,
  ): Promise<GroupResponseDto[]> {
    const groups = await this.listGroupsByEditionUseCase.execute(editionId);
    return GroupResponseDto.fromGroups(groups);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_GROUPS)
  @ApiOperation({ summary: 'Create group for an edition' })
  @ApiResponse({ status: 201, type: GroupResponseDto })
  async create(
    @Param('editionId') editionId: string,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupResponseDto> {
    const group = await this.createGroupUseCase.execute({
      courseId: editionId,
      ...dto,
    });
    return GroupResponseDto.fromGroup(group);
  }

  @Patch(':groupId')
  @UseGuards(GroupEditorGuard)
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, type: GroupResponseDto })
  async update(
    @Param('groupId') groupId: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<GroupResponseDto> {
    await this.updateGroupUseCase.execute(groupId, dto);
    const group = await this.getGroupUseCase.execute(groupId);
    return GroupResponseDto.fromGroup(group);
  }

  @Delete(':groupId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR)
  @RequirePermissions(Permission.MANAGE_GROUPS)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 204 })
  async delete(@Param('groupId') groupId: string): Promise<void> {
    await this.deleteGroupUseCase.execute(groupId);
  }

  @Patch(':groupId/instructor')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.ASSIGN_INSTRUCTORS)
  @ApiOperation({ summary: 'Assign or remove instructor of a group' })
  @ApiResponse({ status: 200, type: GroupResponseDto })
  async assignInstructor(
    @Param('groupId') groupId: string,
    @Body() dto: AssignGroupInstructorDto,
  ): Promise<GroupResponseDto> {
    await this.assignGroupInstructorUseCase.execute(
      groupId,
      dto.instructorId ?? null,
    );
    const group = await this.getGroupUseCase.execute(groupId);
    return GroupResponseDto.fromGroup(group);
  }

  @Post(':groupId/enroll')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.ENROLL_STUDENTS)
  @ApiOperation({ summary: 'Enroll students into a group' })
  @ApiResponse({ status: 200, type: GroupResponseDto })
  async enroll(
    @Param('groupId') groupId: string,
    @Body() dto: EnrollStudentsDto,
  ): Promise<GroupResponseDto> {
    await this.enrollStudentsUseCase.execute({
      groupId,
      userIds: dto.userIds,
    });
    const group = await this.getGroupUseCase.execute(groupId);
    return GroupResponseDto.fromGroup(group);
  }

  @Delete(':groupId/enroll/:userId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR)
  @RequirePermissions(Permission.ENROLL_STUDENTS)
  @ApiOperation({ summary: 'Remove student enrollment from a group' })
  @ApiResponse({ status: 200, type: GroupResponseDto })
  async removeEnrollment(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<GroupResponseDto> {
    await this.removeEnrollmentUseCase.execute(groupId, userId);
    const group = await this.getGroupUseCase.execute(groupId);
    return GroupResponseDto.fromGroup(group);
  }
}
