import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { User } from '../../../auth/domain/entities/user.entity';

@Injectable()
export class CourseAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Solo los administradores pueden realizar esta acción',
      );
    }

    return true;
  }
}
