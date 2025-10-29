import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole, User } from '../../../auth/domain/entities/user.entity';

@Injectable()
export class CourseEditorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER_EDITOR];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Solo los administradores y profesores editores pueden realizar esta acción',
      );
    }

    return true;
  }
}
