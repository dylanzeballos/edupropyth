import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { AUTH_REPOSITORY } from '../../domain/interfaces/auth-repository.interface';
import { AuthResponseDto } from '../../presentation/dto/auth-response.dto';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { UserRole } from '../../domain/entities/user.entity';

interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MicrosoftUserInfo {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  mail: string;
  userPrincipalName: string;
}

Injectable();
export class MicrosoftLoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute(code: string): Promise<AuthResponseDto> {
    try {
      const accessToken = await this.exchangeCodeForToken(code);

      const microsoftUser = await this.getMicrosoftUserInfo(accessToken);

      const email = microsoftUser.mail || microsoftUser.userPrincipalName;

      if (!email) {
        throw new UnauthorizedException('Microsoft email not found');
      }

      let user = await this.authRepository.findByEmail(email);

      if (!user) {
        user = await this.authRepository.create({
          email: email,
          firstName: microsoftUser.givenName || microsoftUser.displayName,
          lastName: microsoftUser.surname || '',
          password: Math.random().toString(36).substring(2, 15),
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

      const jwtAccessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      });

      return {
        accessToken: jwtAccessToken,
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
      console.error('Microsoft login error:', error);
      throw new UnauthorizedException('Invalid Microsoft authentication');
    }
  }

  private async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const clientId = this.configService.get<string>('MICROSOFT_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'MICROSOFT_CLIENT_SECRET',
      );
      const redirectUri = this.configService.get<string>(
        'MICROSOFT_REDIRECT_URI',
      );

      const tokenUrl =
        'https://login.microsoftonline.com/common/oauth2/v2.0/token';

      const params = new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code: code,
        redirect_uri: redirectUri!,
        grant_type: 'authorization_code',
      });

      const response = await firstValueFrom(
        this.httpService.post<MicrosoftTokenResponse>(tokenUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new UnauthorizedException('Failed to exchange code for token');
    }
  }

  private async getMicrosoftUserInfo(
    accessToken: string,
  ): Promise<MicrosoftUserInfo> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<MicrosoftUserInfo>(
          'https://graph.microsoft.com/v1.0/me',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching Microsoft user info:', error);
      throw new UnauthorizedException('Failed to fetch Microsoft user info');
    }
  }
}
