import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { IAuthRepository } from 'src/auth/domain/interfaces/auth-repository.interface';
import { AUTH_REPOSITORY } from 'src/auth/domain/interfaces/auth-repository.interface';
import { RegisterDto } from 'src/auth/presentation/dto/register.dto';
import { User } from 'src/auth/domain/entities/user.entity';

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
      role: registerDto.role,
    });
    return user;
  }
}
