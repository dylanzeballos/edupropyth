import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type JwtPayload = {
  sub: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

type Handshake = {
  headers?: Record<string, unknown> & { authorization?: unknown };
  auth?: Record<string, unknown> & { token?: unknown };
};

type WsClient = {
  handshake?: Handshake;
  user?: JwtPayload;
};

function isObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object';
}

function isWsClient(x: unknown): x is WsClient {
  return isObject(x) && 'handshake' in x;
}

function isJwtPayload(x: unknown): x is JwtPayload {
  return isObject(x) && typeof (x as { sub?: unknown }).sub === 'string';
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const rawClient = context.switchToWs().getClient<unknown>();
    if (!isWsClient(rawClient)) {
      throw new UnauthorizedException('Bad WS client');
    }

    const { handshake } = rawClient;

    // Authorization header: "Bearer <token>"
    const authHeader = handshake?.headers?.authorization as string | undefined;
    const tokenFromHeader =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

    // Handshake auth token
    const tokenFromHandshake = handshake?.auth?.token as string | undefined;

    const token = tokenFromHandshake ?? tokenFromHeader;
    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException('Missing token');
    }

    const decodedUnknown = this.jwtService.verify(token) as unknown;
    if (!isJwtPayload(decodedUnknown)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    rawClient.user = decodedUnknown;
    return true;
  }
}
