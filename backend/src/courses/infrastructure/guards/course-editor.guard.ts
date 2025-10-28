import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/auth/domain/entities/user.entity';

@Injectable()
export class CourseEditorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (![UserRole.ADMIN, UserRole.TEACHER_EDITOR].includes(user.role)) {
      throw new ForbiddenException(
        'Solo los administradores y profesores editores pueden realizar esta acción',
      );
    }

    return true;
  }
}
