import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { AUTH_REPOSITORY } from '../../domain/interfaces/auth-repository.interface';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(payload: JwtPayload): Promise<User> {
    const user = await this.authRepository.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return user;
  }
}
