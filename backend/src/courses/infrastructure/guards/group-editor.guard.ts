import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UserRole, User } from '../../../auth/domain/entities/user.entity';
import { GROUP_REPOSITORY } from '../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';

@Injectable()
export class GroupEditorGuard implements CanActivate {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: { groupId: string };
    }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER_EDITOR];
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    if (user.role === UserRole.TEACHER_EXECUTOR) {
      const groupId = request.params.groupId;
      if (!groupId) {
        throw new ForbiddenException('Group ID not found');
      }

      const group = await this.groupRepo.findById(groupId);
      if (!group) {
        throw new ForbiddenException('Group not found');
      }

      if (group.instructorId === user.id) {
        return true;
      }

      throw new ForbiddenException(
        'Solo puedes editar los grupos donde eres el instructor asignado',
      );
    }

    throw new ForbiddenException('No tienes permisos para editar grupos');
  }
}
