import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateUserUseCase: ValidateUserUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default_secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.validateUserUseCase.execute(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
