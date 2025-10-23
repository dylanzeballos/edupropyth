import { postData } from '@/lib/api';
import {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
} from '../types/login.types';

export interface GoogleAuthResponse extends AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return await postData('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return await postData('/auth/register', data);
  },

  googleAuth: async (idToken: string): Promise<GoogleAuthResponse> => {
    return await postData('/auth/google-login', {
      id_token: idToken,
    });
  },

  githubLogin: async (code: string): Promise<AuthResponse> => {
    return await postData('/auth/github-login', { code });
  },

  microsoftLogin: async (code: string): Promise<AuthResponse> => {
    return await postData('/auth/microsoft-login', { code });
  },

  async logout(): Promise<void> {
    await postData('/auth/logout', {});
  },

  async RefreshToken(): Promise<LoginResponse> {
    return await postData('/auth/refresh', {});
  },
};
