import { User } from './user.type';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginRequest {
  id_token: string;
}

export interface MicrosoftLoginRequest {
  code: string;
}
