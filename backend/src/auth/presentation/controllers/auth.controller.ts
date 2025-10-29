import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { GoogleLoginUseCase } from '../../application/use-cases/google.use-case';
import { MicrosoftLoginUseCase } from '../../application/use-cases/microsoft.use-case';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { GoogleLoginDto, MicrosoftLoginDto } from '../dto/oauth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly microsoftLoginUseCase: MicrosoftLoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerUseCase.execute(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body() googleLoginDto: GoogleLoginDto,
  ): Promise<AuthResponseDto> {
    return await this.googleLoginUseCase.execute(googleLoginDto.id_token);
  }

  @Post('microsoft-login')
  @HttpCode(HttpStatus.OK)
  async microsoftLogin(
    @Body() microsoftLoginDto: MicrosoftLoginDto,
  ): Promise<AuthResponseDto> {
    return await this.microsoftLoginUseCase.execute(microsoftLoginDto.code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
