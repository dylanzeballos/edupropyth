import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { AUTH_REPOSITORY } from '../../domain/interfaces/auth-repository.interface';
import { RegisterDto } from '../../presentation/dto/register.dto';
import { User, UserRole } from '../../domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.authRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('El email ya está en uso');
    }

    const user = await this.authRepository.create({
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: UserRole.STUDENT,
    });
    return user;
  }
}
