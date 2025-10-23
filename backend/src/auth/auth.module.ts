import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Domain
import { User } from './domain/entities/user.entity';
import { AUTH_REPOSITORY } from './domain/interfaces/auth-repository.interface';

// Infrastructure
import { TypeOrmAuthRepository } from './infrastructure/persistence/typeorm-auth.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

// Application
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(
          'jwt.secret',
          'default-secret-change-in-production',
        ),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', '7d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Repository
    {
      provide: AUTH_REPOSITORY,
      useClass: TypeOrmAuthRepository,
    },
    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    ValidateUserUseCase,
    // Strategies
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, ValidateUserUseCase],
})
export class AuthModule {}
