import { apiClient } from '@/lib/api';
import {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
} from '../types/login.types';

export const authService = {
  /**
   * Inicia sesión con email y password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      data,
    );
    return response.data;
  },

  /**
   * Autenticación con Google
   */
  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/google-login',
      {
        id_token: idToken,
      },
    );
    return response.data;
  },

  /**
   * Autenticación con Microsoft
   */
  microsoftLogin: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/microsoft-login',
      {
        code,
      },
    );
    return response.data;
  },

  /**
   * Cierra la sesión del usuario
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar tokens localmente independientemente del resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Refresca el token de acceso
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post<LoginResponse>('/auth/refresh', {
      refreshToken: refreshToken,
    });
    return response.data;
  },
};
