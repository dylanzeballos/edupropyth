import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_URL } from '@/lib/api-config';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000, // 30 segundos
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        const publicRoutes = [
          '/auth/login',
          '/auth/register',
          '/auth/google-login',
          '/auth/github-login',
          '/auth/microsoft-login',
        ];

        const isPublicRoute = publicRoutes.some((route) =>
          config.url?.includes(route),
        );

        if (!isPublicRoute) {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          this.handleAuthFailure();
          return Promise.reject(error);
        }

        if (originalRequest.url?.includes('/auth/refresh')) {
          this.handleAuthFailure();
          return Promise.reject(error);
        }

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(() => {
              const token = localStorage.getItem('access_token');
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await this.client.post('/auth/refresh', {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data;

          localStorage.setItem('access_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          this.processQueue(null);

          return this.client(originalRequest);
        } catch (refreshError) {
          this.processQueue(refreshError);
          this.handleAuthFailure();
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      },
    );
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    this.failedQueue = [];
  }

  private handleAuthFailure() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-storage');

    const currentPath = window.location.pathname;
    if (
      currentPath !== '/login' &&
      currentPath !== '/register' &&
      !currentPath.startsWith('/auth/')
    ) {
      window.location.href = '/login';
    }
  }

  get instance(): AxiosInstance {
    return this.client;
  }

  async get<T>(url: string, config?: Record<string, unknown>) {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: Record<string, unknown>) {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: Record<string, unknown>) {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ) {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: Record<string, unknown>) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();

export const postData = async (endpoint: string, data: unknown) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as { message?: string };
      throw new Error(errorData?.message || error.message);
    }
    throw error;
  }
};

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as { message?: string };
      throw new Error(errorData?.message || error.message);
    }
    throw error;
  }
};

export const putData = async (endpoint: string, data: unknown) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as { message?: string };
      throw new Error(errorData?.message || error.message);
    }
    throw error;
  }
};

export const patchData = async (endpoint: string, data: unknown) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as { message?: string };
      throw new Error(errorData?.message || error.message);
    }
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as { message?: string };
      throw new Error(errorData?.message || error.message);
    }
    throw error;
  }
};
