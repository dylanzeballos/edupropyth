import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/infrastructure/guards';
import { RolesGuard, PermissionsGuard } from '../auth/infrastructure/guards';
import {
  Roles,
  RequirePermissions,
  CurrentUser,
} from '../auth/infrastructure/decorators';
import { UserRole, User } from '../auth/domain/entities/user.entity';
import { Permission } from '../auth/domain/enums/permissions.enum';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-role-status.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.VIEW_ALL_USERS)
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.VIEW_ALL_USERS)
  async getStats() {
    return this.usersService.getRoleStatistics();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.VIEW_ALL_USERS)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch('role')
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.CHANGE_USER_ROLES)
  async updateRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUser() adminUser: User,
  ): Promise<UserResponseDto> {
    return this.usersService.updateRole(updateUserRoleDto, adminUser);
  }

  @Patch('status')
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.DEACTIVATE_USERS)
  async updateStatus(
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @CurrentUser() adminUser: User,
  ): Promise<UserResponseDto> {
    return this.usersService.updateStatus(updateUserStatusDto, adminUser);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User): UserResponseDto {
    return UserResponseDto.fromUser(user);
  }
}
