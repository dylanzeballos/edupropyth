import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (data && user) {
      return user[data as keyof User];
    }

    return user;
  },
);
