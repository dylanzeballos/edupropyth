import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';
import { RealtimeEvent, type CourseEventPayload } from './realtime.events';

interface RoomEmitter {
  emit(event: string, payload: unknown): void;
}
interface IoLike {
  to(room: string): RoomEmitter;
}
interface ClientLike {
  join(room: string): void | Promise<void>;
}

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/ws',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io!: unknown;

  handleConnection(): void {}

  handleDisconnect(): void {
    // Limpieza opcional
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinCourse')
  onJoinCourse(
    @MessageBody() data: { courseId: string },
    @ConnectedSocket() clientUnknown: unknown,
  ) {
    if (!data?.courseId || typeof data.courseId !== 'string') {
      return { ok: false, error: 'courseId required' };
    }

    // Narrow del cliente
    const client = clientUnknown as ClientLike | undefined;
    if (client && typeof client.join === 'function') {
      // evitar await innecesario (no es async), y evitar regla require-await
      void client.join(`course:${data.courseId}`);
    }

    return { ok: true };
  }

  emitCourseUpdated(payload: CourseEventPayload): void {
    // Narrow del servidor
    const io = this.io as IoLike | undefined;
    if (!io || typeof io.to !== 'function') return;

    const room = io.to(`course:${payload.courseId}`);
    if (room && typeof room.emit === 'function') {
      room.emit(RealtimeEvent.COURSE_UPDATED, payload);
    }
  }
}
