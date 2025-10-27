import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/auth/domain/entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-role-status.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return UserResponseDto.fromUser(user);
  }

  async updateRole(
    updateUserRoleDto: UpdateUserRoleDto,
    adminUser: User,
  ): Promise<UserResponseDto> {
    const { userId, role } = updateUserRoleDto;

    if (adminUser.id === userId) {
      throw new ForbiddenException('No puedes actualizar tu propio rol');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (user.role === UserRole.ADMIN && role !== UserRole.ADMIN) {
      const adminCount = await this.userRepository.count({
        where: { role: UserRole.ADMIN, isActive: true },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException(
          'No puedes cambiar el rol del ultimo administrador',
        );
      }
    }

    user.role = role;
    await this.userRepository.save(user);
    return UserResponseDto.fromUser(user);
  }

  async updateStatus(
    updateUserStatusDto: UpdateUserStatusDto,
    adminUser: User,
  ): Promise<UserResponseDto> {
    const { userId, isActive } = updateUserStatusDto;

    if (adminUser.id === userId && !isActive) {
      throw new ForbiddenException('No puedes desactivar tu propia cuenta');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    user.isActive = isActive;
    await this.userRepository.save(user);
    return UserResponseDto.fromUser(user);
  }

  async getRoleStatistics(): Promise<{ role: string; count: string }[]> {
    const stats = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return stats as { role: string; count: string }[];
  }
}
