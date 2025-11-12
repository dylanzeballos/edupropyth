import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { WsJwtGuard } from './ws-jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      // usa tu JWT config
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [RealtimeGateway, WsJwtGuard],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
