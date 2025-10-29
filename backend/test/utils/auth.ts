import request from 'supertest';
import { INestApplication } from '@nestjs/common';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginAs = async (
  app: INestApplication,
  credentials: { email: string; password: string },
): Promise<AuthResponse> => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
    .expect(200);

  return {
    accessToken: response.body.accessToken,
    refreshToken: response.body.refreshToken,
  };
};

export const authHeader = (token: string): Record<string, string> => ({
  Authorization: 'Bearer ' + token,
});
