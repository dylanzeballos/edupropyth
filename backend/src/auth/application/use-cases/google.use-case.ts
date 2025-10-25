import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { IAuthRepository } from 'src/auth/domain/interfaces/auth-repository.interface';
import { AUTH_REPOSITORY } from 'src/auth/domain/interfaces/auth-repository.interface';
import { AuthResponseDto } from 'src/auth/presentation/dto/auth-response.dto';
import { JwtPayload } from 'src/auth/domain/interfaces/jwt-payload.interface';
import { UserRole } from 'src/auth/domain/entities/user.entity';

interface GoogleTokenInfo {
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute(idToken: string): Promise<AuthResponseDto> {
    try {
      const googleUser = await this.verifyGoogleToken(idToken);

      if (!googleUser.email_verified) {
        throw new UnauthorizedException('Google email not verified');
      }

      let user = await this.authRepository.findByEmail(googleUser.email);

      if (!user) {
        user = await this.authRepository.create({
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name,
          lastName: googleUser.family_name || '',
          password: Math.random().toString(36).substring(2, 15), // Random password
          role: UserRole.STUDENT,
          isActive: true,
        });
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User is inactive, contact admin');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  private async verifyGoogleToken(idToken: string): Promise<GoogleTokenInfo> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
        ),
      );
      return response.data as GoogleTokenInfo;
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }
}
